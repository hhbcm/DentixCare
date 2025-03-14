import React from 'react';
import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { showLoading, hideLoading } from '../redux/alertsSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Expresión regular para validar el correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Expresión regular para validar la fortaleza de la contraseña
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Manejar el envío del formulario de registro
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast('Redirigiendo a la página de inicio de sesión');
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Algo salió mal');
    }
  };

  return (
    <div className='authentication'>
      <div className='authentication-form card p-3'>
        <h1 className='card-title'>Regístrate</h1>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item
            label='Nombre'
            name='name'
            rules={[{ required: true, message: 'Por favor, ingrese su nombre' }]}
          >
            <Input placeholder='Nombre' />
          </Form.Item>
          <Form.Item
            label='Correo electrónico'
            name='email'
            rules={[
              { required: true, message: 'Por favor, ingrese su correo electrónico' },
              { pattern: emailRegex, message: 'Por favor, ingrese un correo electrónico válido' }
            ]}
          >
            <Input placeholder='Correo electrónico' />
          </Form.Item>
          <Form.Item
            label='Contraseña'
            name='password'
            rules={[
              { required: true, message: 'Por favor, ingrese su contraseña' },
              { pattern: passwordRegex, message: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales' }
            ]}
          >
            <Input placeholder='Contraseña' type='password' />
          </Form.Item>
          <Button className='primary-button my-2 full-width-button' htmlType='submit'>
            Registrarse
          </Button>
          <Link to='/login' className='anchor mt-2'>
            Clic aquí para Iniciar Sesión
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Register;