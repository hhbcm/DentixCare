import mongoose from 'mongoose';
import Usuario from './Usuario.js';

const pacienteSchema = new mongoose.Schema({
  fechaNacimiento: { type: Date, required: true },
  genero: { type: String, required: true },
  documentoIdentidad: { type: String, required: true },
  deudorMoroso: { type: Boolean, default: false },
  historialMedico: {
    condicionesPrevias: [{ type: String }],
    medicamentosActuales: [{ type: String }],
    cirugiasPrevias: [{ type: String }],
    habitos: [{ type: String }],
  },
  historialOdontologico: {
    ultimaVisita: { type: Date },
    tratamientosPrevios: [{ type: String }],
    diagnosticosPasados: [{ type: String }],
  },
});

const Paciente = Usuario.discriminator('Paciente', pacienteSchema);

export default Paciente;
