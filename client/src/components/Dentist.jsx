import React from 'react';
import { Collapse } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Panel } = Collapse;

function Dentist({ dentist }) {
  const navigate = useNavigate();

  // Formatear el precio para mostrar con separadores de miles y símbolo de moneda
  const formatPrice = (price) => `$ ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

  // Formatear el horario del dentista en el componente Collapse de Ant Design
  const formatSchedule = (schedule) => {
    return schedule.map((day) => (
      <Panel header={<span className="schedule-day">{day.day}</span>} key={day._id}>
        {day.times.length > 0 ? (
          day.times.map((time) => (
            <div key={time._id}>
              {time.start} - {time.end}
            </div>
          ))
        ) : (
          <div>No disponible</div>
        )}
      </Panel>
    ));
  };

  return (
    <div className='card p-2'>
      <h1 className="card-title cursor-pointer" onClick={() => navigate(`/book-appointment/${dentist._id}`)}>
        {dentist.firstName} {dentist.lastName}
      </h1>
      <hr />
      <p><b>Especialización:</b> {dentist.specialization}</p>
      <p><b>Correo:</b> {dentist.email}</p>
      <p><b>Teléfono:</b> {dentist.phoneNumber}</p>
      <p><b>Dirección:</b> {dentist.address}</p>
      <p><b>Precio por Consulta:</b> {formatPrice(dentist.feePerConsultation)}</p>
      <Collapse>
        <Panel header={<span className="schedule-header">Horario</span>} key="1">
          <Collapse>
            {formatSchedule(dentist.schedule)}
          </Collapse>
        </Panel>
      </Collapse>
    </div>
  );
}

export default Dentist;
