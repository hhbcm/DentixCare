const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Dentist = require('../models/dentistModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const Appointment = require('../models/appointmentModel');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

// Usa el plugin customParseFormat
dayjs.extend(customParseFormat);

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(200).send({ message: 'El correo electrónico ya está registrado', success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).send({ message: 'Usuario registrado exitosamente', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creando el usuario', success: false, error: error });
  }
});

// Inicio de sesión de usuario
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: 'El usuario ingresado no existe', success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: 'Contraseña incorrecta', success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(200).send({ message: 'Inicio de sesión exitoso', success: true, data: token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error iniciando sesión', success: false, error: error });
  }
});

// Obtener información del usuario por ID
router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    user.password = undefined; // Ocultar la contraseña del usuario
    if (!user) {
      return res.status(200).send({ message: 'Usuario no encontrado', success: false });
    } else {
      return res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error obteniendo la información del usuario', success: false, error: error });
  }
});

// Solicitud para ser odontólogo
router.post('/apply-dentist-account', authMiddleware, async (req, res) => {
  try {
    const newDentist = new Dentist({ ...req.body, applicationStatus: 'Pendiente' });
    await newDentist.save();
    const adminUser = await User.findOne({ isAdmin: true });
    adminUser.unseenNotifications.push({
      type: 'new-dentist-request',
      data: {
        dentistId: newDentist._id,
        name: `${newDentist.firstName} ${newDentist.lastName}`,
      },
      onClickPath: '/admin/dentistslist',
      message: `Nuevo odontólogo solicitando cuenta: ${newDentist.firstName} ${newDentist.lastName}`,
      date: new Date(),
    });
    await adminUser.save();
    res.status(200).send({ message: 'Solicitud enviada exitosamente', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error aplicando para ser odontólogo', success: false, error: error });
  }
});

// Marcar todas las notificaciones como leídas
router.post('/mark-all-notifications-as-seen', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotifications.push(...user.unseenNotifications);
    user.unseenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined; // Ocultar la contraseña del usuario
    res.status(200).send({ message: 'Notificaciones marcadas como leídas', success: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error marcando las notificaciones como leídas', success: false, error: error });
  }
});

// Eliminar todas las notificaciones vistas
router.post('/delete-all-notifications', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotifications = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined; // Ocultar la contraseña del usuario
    res.status(200).send({ message: 'Notificaciones eliminadas', success: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error eliminando las notificaciones', success: false, error: error });
  }
});

// Obtener todos los odontólogos aprobados
router.get('/get-all-approved-dentists', authMiddleware, async (req, res) => {
  try {
    const dentists = await Dentist.find({ applicationStatus: 'Aprobado' });
    const dentistsWithUserDetails = await Promise.all(
      dentists.map(async (dentist) => {
        const user = await User.findById(dentist.userId);
        return { ...dentist._doc, email: user.email };
      })
    );
    res.status(200).send({ success: true, data: dentistsWithUserDetails, message: 'Lista de dentistas obtenida exitosamente' });
  } catch (error) {
    res.status(500).send({ message: 'Error obteniendo la lista de dentistas', success: false });
  }
});

// Reserva de cita
router.post('/book-appointment', authMiddleware, async (req, res) => {
  try {
    const date = dayjs(req.body.date, 'YYYY-MM-DD', true).format('YYYY-MM-DD');
    const time = dayjs(req.body.time, 'HH:mm', true).format('HH:mm');
    const newAppointment = new Appointment({
      dentistId: req.body.dentistId,
      userId: req.body.userId,
      dentistInfo: req.body.dentistInfo,
      userInfo: req.body.userInfo,
      date: date,
      time: time,
      bookingStatus: 'Asignada',
    });
    await newAppointment.save();
    const user = await User.findOne({ _id: req.body.dentistInfo.userId });
    if (!user) {
      throw new Error('Dentista no encontrado');
    }
    user.unseenNotifications.push({
      type: 'new-appointment-request',
      message: `${req.body.userInfo.name} ha reservado una cita contigo`,
      onClickPath: '/appointments',
    });
    await user.save();
    res.status(200).send({ message: 'Cita reservada satisfactoriamente', success: true });
  } catch (error) {
    console.error('Error reservando la cita:', error);
    res.status(500).send({ message: 'Error reservando la cita', success: false });
  }
});

// Comprobar disponibilidad de cita
router.post('/check-booking-availability', authMiddleware, async (req, res) => {
  try {
    const date = dayjs(req.body.date, 'YYYY-MM-DD', true).format('YYYY-MM-DD');
    const time = dayjs(req.body.time, 'HH:mm', true).format('HH:mm');

    const appointments = await Appointment.find({
      dentistId: req.body.dentistId,
      date: date,
      time: time,
      bookingStatus: 'Asignada',
    });

    if (appointments.length > 0) {
      return res.status(200).send({ message: 'Citas no disponibles', success: false });
    } else {
      res.status(200).send({ message: 'Citas disponibles', success: true });
    }
  } catch (error) {
    console.error('Error comprobando disponibilidad de cita:', error);
    res.status(500).send({ message: 'Error comprobando disponibilidad de cita', success: false });
  }
});

// Obtener las citas del usuario autenticado (paciente u odontólogo)
router.get('/get-appointments', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Obtener el ID del usuario autenticado desde el middleware
    let query = { bookingStatus: 'Asignada' };

    if (req.user.isDentist) {
      // Obtener el id del dentista usando userId
      const dentist = await Dentist.findOne({ userId: userId });
      if (dentist) {
        query.dentistId = dentist._id; // Utilizar _id del dentista
      } else {
        return res.status(404).send({
          message: 'Odontólogo no encontrado',
          success: false,
        });
      }
    } else {
      query.userId = userId;
    }

    const appointments = await Appointment.find(query);

    res.status(200).send({
      message: 'Citas obtenidas exitosamente',
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('Error obteniendo citas:', error);
    res.status(500).send({
      message: 'Error obteniendo citas',
      success: false,
      error: error,
    });
  }
});

// Cancelar cita
router.post('/cancel-appointment', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.body.id,
      { bookingStatus: 'Cancelada' },
      { new: true }
    );
    res.status(200).send({
      message: 'Cita cancelada exitosamente',
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Error cancelando la cita:', error);
    res.status(500).send({
      message: 'Error cancelando la cita',
      success: false,
      error: error,
    });
  }
});

// Marcar cita como pagada
router.post('/mark-appointment-paid', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.body.id,
      { bookingStatus: 'Pagada' },
      { new: true }
    );
    res.status(200).send({
      message: 'Cita marcada como pagada exitosamente',
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Error marcando la cita como pagada:', error);
    res.status(500).send({
      message: 'Error marcando la cita como pagada',
      success: false,
      error: error,
    });
  }
});

// Marcar cita como paciente no asistió
router.post('/mark-appointment-missed', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.body.id,
      { bookingStatus: 'Paciente no asistió' },
      { new: true }
    );
    res.status(200).send({
      message: 'Cita marcada como paciente no asistió exitosamente',
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Error marcando la cita como paciente no asistió:', error);
    res.status(500).send({
      message: 'Error marcando la cita como paciente no asistió',
      success: false,
      error: error,
    });
  }
});

module.exports = router;
