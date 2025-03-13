import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button, Col, DatePicker, Row } from 'antd';
import '../index.css';

function BookAppointment() {
  const [schedule, setSchedule] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.alerts);
  const [dentist, setDentist] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isAdmin || user?.isDentist) {
      navigate('/');
    }
  }, [user, navigate]);

  // Obtener información del dentista
  const getDentistData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        '/api/dentist/get-dentist-info-by-id',
        { dentistId: params.dentistId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDentist(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error('Error obteniendo datos del dentista:', error);
    }
  };

  // Verificar las citas disponibles
  const checkAvailability = async (date) => {
    setLoadingAvailability(true);
    const availableTimes = [];
    const selectedDay = dayjs(date).format('dddd').toLowerCase();
    const capitalizedDay = selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1);
    const daySchedule = schedule[capitalizedDay];

    if (!daySchedule) {
      setLoadingAvailability(false);
      return;
    }

    const availabilityPromises = [];

    for (let i = 0; i < daySchedule.length; i++) {
      const [start, end] = daySchedule[i];
      const startTime = dayjs(`${dayjs(date).format('YYYY-MM-DD')} ${start}`);
      const endTime = dayjs(`${dayjs(date).format('YYYY-MM-DD')} ${end}`);

      for (let time = startTime; time.isBefore(endTime); time = time.add(20, 'minute')) {
        availabilityPromises.push(
          axios.post(
            '/api/user/check-booking-availability',
            {
              dentistId: params.dentistId,
              date: dayjs(date).format('YYYY-MM-DD'),
              time: time.format('HH:mm'),
            },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
          ).then(response => {
            if (response.data.success) {
              availableTimes.push(time.format('HH:mm'));
            }
          })
        );
      }
    }

    await Promise.all(availabilityPromises);
    availableTimes.sort((a, b) => dayjs(a, 'HH:mm').diff(dayjs(b, 'HH:mm'))); // Ordenar los tiempos
    setAvailableTimes(availableTimes);
    setLoadingAvailability(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      checkAvailability(date);
    }
  };

  const bookAppointment = async (time) => {
    try {
      const response = await axios.post(
        '/api/user/book-appointment',
        {
          dentistId: params.dentistId,
          userId: user._id,
          dentistInfo: dentist,
          userInfo: user,
          date: dayjs(selectedDate).format('YYYY-MM-DD'),
          time,
          bookingStatus: 'Asignada',
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.data.success) {
        toast.success('Cita reservada satisfactoriamente');
        navigate('/appointments');
      } else {
        toast.error('Error reservando la cita');
      }
    } catch (error) {
      toast.error('Error reservando la cita');
      console.error('Error reservando la cita:', error);
    }
  };

  useEffect(() => {
    getDentistData();
  }, []);

  useEffect(() => {
    if (dentist) {
      const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      const verifiedSchedule = {};

      daysOfWeek.forEach((day) => {
        const dayTimes = dentist.schedule?.find((item) => item.day === day)?.times || [];
        verifiedSchedule[day] = dayTimes.map((time) => [time.start, time.end]);
      });

      setSchedule(verifiedSchedule);
    }
  }, [dentist]);

  const isDayAvailable = (current) => {
    const day = dayjs(current).format('dddd').toLowerCase();
    const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
    return !!schedule[capitalizedDay];
  };

  return (
    <Layout>
      {loading && (
        <div className="spinner-parent">
          <div className="spinner-border" role="status"></div>
        </div>
      )}
      {dentist && (
        <div>
          <Row>
            <Col span={12} offset={6}>
              <h1 className="page-title">
                Reservar Cita con {dentist.firstName} {dentist.lastName}
              </h1>
              <DatePicker
                format="DD-MM-YYYY"
                className="mt-3"
                onChange={handleDateChange}
                disabledDate={(current) => {
                  return current && (current < dayjs().startOf('day') || !isDayAvailable(current));
                }}
              />
              {selectedDate && loadingAvailability && (
                <div className="spinner-parent">
                  <div className="spinner-border" role="status"></div>
                </div>
              )}
              {selectedDate && !loadingAvailability && availableTimes.length === 0 && (
                <p className="mt-3 no-appointments-message">
                  No hay citas disponibles para este día.
                </p>
              )}
              {availableTimes.length > 0 && (
                <div className="appointment-list-container">
                  <h3 className='card-title'>Horarios:</h3>
                  <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                    {availableTimes.map((time) => (
                      <li key={time} className="appointment-item">
                        <span className="time-text">{time}</span>
                        <Button onClick={() => bookAppointment(time)} type="primary">
                          Pedir cita
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;