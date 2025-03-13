const mongoose = require('mongoose');

// Definir el esquema de citas
const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  dentistId: { type: String, required: true },
  dentistInfo: { type: Object, required: true },
  userInfo: { type: Object, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  bookingStatus: { type: String, required: true, default: 'Pendiente' }
}, {
  timestamps: true,
});

// Crear el modelo de citas a partir del esquema
const appointmentModel = mongoose.model('appointment', appointmentSchema);

module.exports = appointmentModel;
