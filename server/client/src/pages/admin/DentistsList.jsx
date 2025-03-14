import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';

function DentistsList() {
  const [dentists, setDentists] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const getDentistsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get('/api/admin/get-all-dentists', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDentists(response.data.data);
      } else {
        toast.error('Error obteniendo la lista de odontólogos');
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Error obteniendo la lista de odontólogos');
    }
  };

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/');
    } else {
      getDentistsData();
    }
  }, [user, navigate]);

  const changeDentistStatus = async (record, applicationStatus) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        '/api/admin/change-dentist-account-status',
        { dentistId: record._id, userId: record.userId, applicationStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getDentistsData();
      } else {
        toast.error('Error cambiando el estado del odontólogo');
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Error cambiando el estado del odontólogo');
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      render: (text, record) => `${record.firstName} ${record.lastName}`,
    },
    { title: 'Teléfono', dataIndex: 'phoneNumber' },
    { title: 'Creación de Cuenta', dataIndex: 'createdAt' },
    { title: 'Estado de Aplicación', dataIndex: 'applicationStatus' },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex">
          {record.applicationStatus === 'Pendiente' && (
            <button className="anchor" onClick={() => changeDentistStatus(record, 'Aprobado')}>Aprobar</button>
          )}
          {record.applicationStatus === 'Aprobado' && (
            <button className="anchor" onClick={() => changeDentistStatus(record, 'Bloqueado')}>Bloquear</button>
          )}
        </div>
      ),
    },
  ];

  const tableLocale = { emptyText: 'No hay solicitudes de cuentas de odontólogos pendientes de aprobación' };

  return (
    <Layout>
      <h1 className="page-title">Lista de Odontólogos</h1>
      <Table columns={columns} dataSource={dentists} locale={tableLocale} />
    </Layout>
  );
}

export default DentistsList;
