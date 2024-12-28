import mongoose from 'mongoose';
import Usuario from './Usuario.js';

const periodoTrabajoSchema = new mongoose.Schema({
  inicio: { type: String, required: true },
  fin: { type: String, required: true },
  descansos: [{
    inicio: { type: String },
    fin: { type: String },
  }],
});

const horarioTrabajoSchema = new mongoose.Schema({
  dia: { type: String, required: true },
  periodos: [periodoTrabajoSchema],
});

const odontologoSchema = new mongoose.Schema({
  especialidad: { type: String, required: true },
  consultorio: { type: String, required: true },
  numeroLicencia: { type: String, required: true },
  experiencia: { type: Number, required: true },
  horarioTrabajo: [horarioTrabajoSchema],
  perfilProfesional: {
    educacion: { type: String },
    certificaciones: { type: String },
    afiliaciones: { type: String },
  },
});

const Odontologo = Usuario.discriminator('Odontologo', odontologoSchema);

export default Odontologo;
