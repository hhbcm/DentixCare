import mongoose from 'mongoose';

const historiaClinicaSchema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  odontologo: { type: mongoose.Schema.Types.ObjectId, ref: 'Odontologo', required: true },
  fechaCreacion: { type: Date, default: Date.now },
  anamesis: { type: String },
  odontograma: [{
    diente: { type: String, required: true },
    estado: { type: String, required: true },
    observaciones: { type: String },
  }],
  periodontograma: [{
    sector: { type: String, required: true },
    estado: { type: String, required: true },
    observaciones: { type: String },
  }],
  rx: [{
    imagen: { type: String },
    descripcion: { type: String },
  }],
  documentos: [{
    archivo: { type: String },
    descripcion: { type: String },
  }],
  tratamientos: [{
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    costo: { type: Number, required: true },
    citas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cita' }],
  }],
  notasAdicionales: { type: String },
});

const HistoriaClinica = mongoose.model('HistoriaClinica', historiaClinicaSchema);

export default HistoriaClinica;
