const express = require('express');
const app = express();
require('dotenv').config();
const dbConfig = require('./config/dbConfig');
const cors = require('cors');

// Middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Configuración de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Cambia esto a la URL de tu frontend en Render
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rutas de la aplicación
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const dentistRoute = require('./routes/dentistRoute');

// Uso de las rutas
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/dentist', dentistRoute);

// Configuración del puerto
const port = process.env.PORT || 5000;

// Iniciar el servidor
app.listen(port, () => console.log(`Servidor Node iniciado en el puerto ${port}`));