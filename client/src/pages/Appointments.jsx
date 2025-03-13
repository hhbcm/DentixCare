import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('/api/user/get-appointments', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.success) {
          const assignedAppointments = response.data.data.filter(
            (appointment) => appointment.bookingStatus === 'Asignada'
          );
          setAppointments(assignedAppointments);
        }
      } catch (error) {
        message.error('Error al obtener las citas');
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const cancelAppointment = async (id) => {
    try {
      const response = await axios.post(
        '/api/user/cancel-appointment',
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        message.success('Cita cancelada');
        setAppointments(appointments.filter((appt) => appt._id !== id));
      }
    } catch (error) {
      message.error('Error al cancelar la cita');
    }
  };

  const markAsPaid = async (id) => {
    try {
      const response = await axios.post(
        '/api/user/mark-appointment-paid',
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        message.success('Cita marcada como pagada');
        setAppointments(appointments.filter((appt) => appt._id !== id));
      }
    } catch (error) {
      message.error('Error al marcar la cita como pagada');
    }
  };

  const markAsMissed = async (id) => {
    try {
      const response = await axios.post(
        '/api/user/mark-appointment-missed',
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        message.success('Cita marcada como paciente no asistió');
        setAppointments(appointments.filter((appt) => appt._id !== id));
      }
    } catch (error) {
      message.error('Error al marcar la cita como paciente no asistió');
    }
  };

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Hora',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: user?.isDentist ? 'Paciente' : 'Odontólogo',
      dataIndex: user?.isDentist ? 'userInfo' : 'dentistInfo',
      key: user?.isDentist ? 'userInfo' : 'dentistInfo',
      render: (info) =>
        user?.isDentist
          ? `${info.name}`
          : `${info.firstName} ${info.lastName}`,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (text, record) => (
        <div className="d-flex" style={{ gap: '8px' }}>
          <Button type="primary" danger onClick={() => cancelAppointment(record._id)}>
            Cancelar
          </Button>
          {user?.isDentist && (
            <>
              <Button type="primary" onClick={() => markAsPaid(record._id)}>
                Marcar como pagada
              </Button>
              <Button type="primary" onClick={() => markAsMissed(record._id)}>
                Paciente no asistió
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <Layout>
      <h1 className="page-title">Citas Programadas</h1>
      <Table dataSource={appointments} columns={columns} rowKey="_id" />
    </Layout>
  );
}

export default Appointments;