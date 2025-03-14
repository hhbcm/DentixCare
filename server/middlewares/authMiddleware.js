const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Token inválido', success: false });
      } else {
        const user = await User.findById(decoded.id);
        if (user.isBlocked) {
          return res.status(403).send({ message: 'Su cuenta está bloqueada.', success: false });
        }
        req.user = { id: decoded.id, isDentist: user.isDentist, isAdmin: user.isAdmin }; // Agregar el ID del usuario autenticado a req.user
        next();
      }
    });
  } catch (error) {
    return res.status(401).send({ message: 'Autenticación fallida', success: false });
  }
};