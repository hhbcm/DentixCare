import React from 'react';
import { Navigate } from 'react-router-dom';

function PublicRoute({ children }) {
  // Si el usuario ya está autenticado (token presente), redirigir a la página principal
  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}

export default PublicRoute;