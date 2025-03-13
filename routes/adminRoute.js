const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Dentist = require('../models/dentistModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para obtener todos los odontólogos
router.get('/get-all-dentists', authMiddleware, async (req, res) => {
  try {
    const dentists = await Dentist.find({});
    res.status(200).send({ success: true, data: dentists, message: 'Lista de dentistas obtenida exitosamente' });
  } catch (error) {
    res.status(500).send({ message: 'Error obteniendo la lista de dentistas', success: false });
  }
});

// Ruta para obtener todos los usuarios
router.get('/get-all-users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({ success: true, data: users, message: 'Lista de usuarios obtenida exitosamente' });
  } catch (error) {
    res.status(500).send({ message: 'Error obteniendo la lista de usuarios', success: false });
  }
});

// Ruta para cambiar el estado de la cuenta del odontólogo
router.post('/change-dentist-account-status', authMiddleware, async (req, res) => {
  try {
    const { dentistId, applicationStatus } = req.body;
    const dentist = await Dentist.findByIdAndUpdate(dentistId, { applicationStatus });
    const user = await User.findOne({ _id: dentist.userId });

    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: 'new-doctor-request-changed',
      message: `Su solicitud ha sido: ${applicationStatus}`,
      link: '/notifications',
    });

    user.isDentist = applicationStatus === 'Aprobado' ? true : false;
    await user.save();

    res.status(200).send({ success: true, data: dentist, message: 'Estado del odontólogo actualizado exitosamente' });
  } catch (error) {
    res.status(500).send({ message: 'Error cambiando el estado del odontólogo', success: false });
  }
});

// Ruta para cambiar el estado de bloqueo del usuario
router.post('/change-user-block-status', authMiddleware, async (req, res) => {
  try {
    const { userId, isBlocked } = req.body;

    // Verificar que los datos han sido recibidos correctamente
    console.log('Datos recibidos:', { userId, isBlocked }); // Agregar este console.log para verificar los datos

    if (!userId || typeof isBlocked === 'undefined') {
      return res.status(400).send({
        message: 'Datos inválidos',
        success: false,
      });
    }

    // Verificar si el usuario autenticado es un administrador
    if (!req.user.isAdmin) {
      return res.status(403).send({
        message: 'No tiene permisos para realizar esta acción.',
        success: false,
      });
    }

    // Verificar si el usuario a bloquear es un administrador
    const user = await User.findById(userId);
    if (user.isAdmin) {
      return res.status(400).send({
        message: 'No se puede bloquear a un administrador.',
        success: false,
      });
    }

    user.isBlocked = isBlocked;
    await user.save();

    res.status(200).send({
      success: true,
      message: `El usuario ha sido ${isBlocked ? 'bloqueado' : 'desbloqueado'} exitosamente.`,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error cambiando el estado del usuario',
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
