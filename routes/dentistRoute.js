const express = require('express');
const router = express.Router();
const Dentist = require('../models/dentistModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para obtener la información del dentista por ID de usuario
router.post('/get-dentist-info-by-user-id', authMiddleware, async (req, res) => {
  try {
    const dentist = await Dentist.findOne({ userId: req.body.userId });
    res.status(200).send({ success: true, data: dentist, message: 'Información del odontólogo obtenida exitosamente' });
  } catch (error) {
    res.status(500).send({ message: 'Error obteniendo la información del odontólogo', success: false, error: error });
  }
});

// Ruta para obtener la información del dentista por ID del dentista
router.post('/get-dentist-info-by-id', authMiddleware, async (req, res) => {
  try {
    const dentist = await Dentist.findOne({ _id: req.body.dentistId });
    res.status(200).send({ success: true, data: dentist, message: 'Información del odontólogo obtenida exitosamente' });
  } catch (error) {
    res.status(500).send({ message: 'Error obteniendo la información del odontólogo', success: false, error: error });
  }
});

// Ruta para actualizar el perfil del dentista
router.post('/update-dentist-profile', authMiddleware, async (req, res) => {
  try {
    const dentist = await Dentist.findOneAndUpdate({ userId: req.body.userId }, req.body);
    res.status(200).send({ success: true, data: dentist, message: 'Información del odontólogo actualizada exitosamente' });
  } catch (error) {
    res.status(500).send({ message: 'Error actualizando la información del odontólogo', success: false, error: error });
  }
});

module.exports = router;
