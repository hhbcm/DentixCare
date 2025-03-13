const mongoose = require('mongoose');

// Esquema de rango de tiempo
const timeRangeSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
});

// Esquema del horario
const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  times: [timeRangeSchema],
});

// Esquema del dentista
const dentistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  website: { type: String, required: true },
  address: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  feePerConsultation: { type: Number, required: true },
  applicationStatus: { type: String, default: 'Pendiente' },
  schedule: [scheduleSchema],
}, {
  timestamps: true,
});

// Modelo del dentista
const dentistModel = mongoose.model('dentist', dentistSchema);

module.exports = dentistModel;
