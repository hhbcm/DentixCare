// userModel.js
const mongoose = require('mongoose');

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Por favor, ingrese su nombre'] },
  email: { type: String, required: [true, 'Por favor, ingrese su correo electrónico'], unique: true },
  password: { type: String, required: [true, 'Por favor, ingrese su contraseña'] },
  isDentist: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false }, // Nuevo campo para usuarios bloqueados
  seenNotifications: { type: Array, default: [] },
  unseenNotifications: { type: Array, default: [] },
}, {
  timestamps: true
});

// Crear el modelo de usuario a partir del esquema
const userModel = mongoose.model('users', userSchema);
module.exports = userModel;
