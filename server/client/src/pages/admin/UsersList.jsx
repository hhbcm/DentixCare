import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function UsersList() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/get-all-users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        console.error('Error obteniendo la lista de usuarios');
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error('Error obteniendo la lista de usuarios:', error);
    }
  };

  const changeUserBlockStatus = async (record, isBlocked) => {
    try {
      dispatch(showLoading());
      console.log({ userId: record._id, isBlocked }); // Agregar este console.log para verificar los datos
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/change-user-block-status`,
        { userId: record._id, isBlocked },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        getUsersData();
      } else {
        console.error('Error cambiando el estado del usuario');
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error('Error cambiando el estado del usuario:', error);
    }
  };

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/');
    } else {
      getUsersData();
    }
  }, [user, navigate]);

  const columns = [
    { title: 'Nombre', dataIndex: 'name' },
    { title: 'Correo', dataIndex: 'email' },
    { title: 'Creación de Cuenta', dataIndex: 'createdAt' },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex">
          <Button onClick={() => changeUserBlockStatus(record, !record.isBlocked)}>
            {record.isBlocked ? 'Desbloquear' : 'Bloquear'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="page-title">Lista de Usuarios</h1>
      <Table columns={columns} dataSource={users} />
    </Layout>
  );
}

export default UsersList;