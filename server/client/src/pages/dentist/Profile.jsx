import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import DentistForm from '../../components/DentistForm';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

function Profile() {
  const [schedule, setSchedule] = useState({
    Lunes: [], Martes: [], Miércoles: [], Jueves: [], Viernes: [], Sábado: [], Domingo: [],
  });
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const params = useParams();
  const [dentist, setDentist] = useState(null);
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
        start: dayjs(timeRange[0]).format('HH:mm'),
        end: dayjs(timeRange[1]).format('HH:mm')
      })),
    }));
  };

  // Manejar el envío del formulario
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const transformedSchedule = transformSchedule(schedule);
      const response = await axios.post('/api/dentist/update-dentist-profile', {
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

  // Obtener la información del odontólogo
  const getDentistData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/dentist/get-dentist-info-by-user-id', {
        userId: params.userId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDentist(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  // Redirigir si el usuario no es dentista
  useEffect(() => {
    if (user && !user.isDentist) {
      navigate('/');
    }
  }, [user, navigate]);

  // Transformar y verificar el horario al recibir datos del servidor
  useEffect(() => {
    getDentistData();
  }, []);

  useEffect(() => {
    if (dentist) {
      const verifiedSchedule = {
        Lunes: (dentist.schedule?.find(item => item.day === 'Lunes')?.times || []).map(time => [dayjs(time.start, 'HH:mm'), dayjs(time.end, 'HH:mm')]),
        Martes: (dentist.schedule?.find(item => item.day === 'Martes')?.times || []).map(time => [dayjs(time.start, 'HH:mm'), dayjs(time.end, 'HH:mm')]),
        Miércoles: (dentist.schedule?.find(item => item.day === 'Miércoles')?.times || []).map(time => [dayjs(time.start, 'HH:mm'), dayjs(time.end, 'HH:mm')]),
        Jueves: (dentist.schedule?.find(item => item.day === 'Jueves')?.times || []).map(time => [dayjs(time.start, 'HH:mm'), dayjs(time.end, 'HH:mm')]),
        Viernes: (dentist.schedule?.find(item => item.day === 'Viernes')?.times || []).map(time => [dayjs(time.start, 'HH:mm'), dayjs(time.end, 'HH:mm')]),
        Sábado: (dentist.schedule?.find(item => item.day === 'Sábado')?.times || []).map(time => [dayjs(time.start, 'HH:mm'), dayjs(time.end, 'HH:mm')]),
        Domingo: (dentist.schedule?.find(item => item.day === 'Domingo')?.times || []).map(time => [dayjs(time.start, 'HH:mm'), dayjs(time.end, 'HH:mm')]),
      };
      setSchedule(verifiedSchedule);
    }
  }, [dentist]);

  return (
    <Layout>
      <h1 className="page-title">Perfil Odontológico</h1>
      <hr />
      {dentist && (
        <DentistForm
          onFinish={onFinish}
          initialValues={dentist}
          schedule={schedule}
          handleAddRange={handleAddRange}
          handleRangeChange={handleRangeChange}
          handleDeleteRange={handleDeleteRange}
          specialties={specialties}
        />
      )}
    </Layout>
  );
}

export default Profile;
