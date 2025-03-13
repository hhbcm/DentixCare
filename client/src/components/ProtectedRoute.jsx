import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/userSlice';
import { hideLoading, showLoading } from '../redux/alertsSlice';

function ProtectedRoute({ children }) {
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Obtener la información del usuario si no está almacenada en el estado
  const getUser = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/user/get-user-info-by-id', { 
        token: localStorage.getItem("token")
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        dispatch(setUser(response.data.data));
      } else {
        localStorage.clear();
        navigate('/login');
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.clear();
      navigate('/login');
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user, navigate]);

  // Verificar si el token está presente
  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
