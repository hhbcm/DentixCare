import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import DentistForm from '../components/DentistForm';

function ApplyDentist() {
  const [schedule, setSchedule] = useState({
    Lunes: [],
    Martes: [],
    Miércoles: [],
    Jueves: [],
    Viernes: [],
    Sábado: [],
    Domingo: [],
  });
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();

  // Añadir un rango de tiempo al horario
  const handleAddRange = (day) => {
    const newSchedule = { ...schedule };
    newSchedule[day].push([]);
    setSchedule(newSchedule);
  };

  // Eliminar un rango de tiempo del horario
  const handleDeleteRange = (day, index) => {
    const newSchedule = { ...schedule };
    newSchedule[day].splice(index, 1);
    setSchedule(newSchedule);
  };

  // Cambiar un rango de tiempo en el horario
  const handleRangeChange = (day, index, value) => {
    const newSchedule = { ...schedule };
    newSchedule[day][index] = value;
    setSchedule(newSchedule);
  };

  // Transformar el horario para la solicitud
  const transformSchedule = (schedule) => {
    return Object.entries(schedule).map(([day, times]) => ({
      day,
      times: times.map(timeRange => ({
        start: timeRange[0]?.format('HH:mm'),
        end: timeRange[1]?.format('HH:mm')
      })),
    }));
  };

  // Manejar el envío del formulario
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const transformedSchedule = transformSchedule(schedule);
      const response = await axios.post('/api/user/apply-dentist-account', {
        ...values,
        userId: user._id,
        schedule: transformedSchedule,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Algo salió mal');
    }
  };

  const specialties = [
    'Odontología General', 'Endodoncia', 'Ortodoncia', 'Periodoncia',
    'Cirugía Oral y Maxilofacial', 'Odontopediatría', 'Prostodoncia',
    'Patología Oral y Maxilofacial', 'Radiología Oral y Maxilofacial',
    'Odontología de Salud Pública', 'Anestesiología Dental', 'Odontología Forense',
  ];

  return (
    <Layout>
      <h1 className='page-title'>Aplicar para ser Odontólogo</h1>
      <hr />
      <DentistForm 
        onFinish={onFinish} 
        schedule={schedule}
        handleAddRange={handleAddRange}
        handleRangeChange={handleRangeChange}
        handleDeleteRange={handleDeleteRange}
        specialties={specialties} 
      />
    </Layout>
  );
}

export default ApplyDentist;
