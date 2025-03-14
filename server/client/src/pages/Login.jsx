import React from 'react';
import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { showLoading, hideLoading } from '../redux/alertsSlice';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Manejar el envío del formulario de inicio de sesión
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast('Redirigiendo a la página de inicio');
        localStorage.setItem('token', response.data.data);
        navigate('/');
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
        <h1 className='card-title'>Inicia Sesión</h1>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item
            label='Correo electrónico'
            name='email'
            rules={[{ required: true, message: 'Por favor, ingrese su correo electrónico' }]}
          >
            <Input placeholder='Correo electrónico' />
          </Form.Item>
          <Form.Item
            label='Contraseña'
            name='password'
            rules={[{ required: true, message: 'Por favor, ingrese su contraseña' }]}
          >
            <Input placeholder='Contraseña' type='password' />
          </Form.Item>
          <Button className='primary-button my-2 full-width-button' htmlType='submit'>
            Iniciar Sesión
          </Button>
          <Link to='/register' className='anchor mt-2'>
            Clic aquí para Registrarse
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Login;