import mongoose from 'mongoose';

const citaSchema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  odontologo: { type: mongoose.Schema.Types.ObjectId, ref: 'Odontologo', required: true },
  fecha: { type: Date, required: true },
  duracion: { type: Number, required: true },
  estado: { type: String, enum: ['Disponible', 'Programada', 'Cancelada', 'Realizada'], default: 'Disponible' },
  pagada: { type: Boolean, default: false },
});

const Cita = mongoose.model('Cita', citaSchema);

export default Cita;
