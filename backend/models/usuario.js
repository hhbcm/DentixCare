import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const usuarioSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  direccion: { type: String },
  foto: { type: String },
  rol: { type: String, enum: ['Paciente', 'Odontologo'], required: true },
  password: { type: String, required: true },
}, { discriminatorKey: 'rol' });

const Usuario = model('Usuario', usuarioSchema);

export default Usuario;
