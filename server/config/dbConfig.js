const mongoose = require('mongoose');

// Conexión a la base de datos de MongoDB usando la URL proporcionada en las variables de entorno
const connect = mongoose.connect(process.env.MONGO_URL);

// Verificar la conexión exitosa
const connection = mongoose.connection;
connection.on('connected', () => {
  console.log('Conexión a MongoDB establecida');
});

// Manejar errores de conexión
connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB: ', err);
});

module.exports = mongoose;
