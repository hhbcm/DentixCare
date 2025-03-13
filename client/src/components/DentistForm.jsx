import React from 'react';
import { Form, Input, TimePicker, Select, Button, Collapse, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { RangePicker } = TimePicker;
const { Option } = Select;
const { Panel } = Collapse;

const DentistForm = ({
  onFinish,
  initialValues,
  schedule,
  handleAddRange,
  handleRangeChange,
  handleDeleteRange,
  specialties
}) => {

  // Verificar si hay conflictos en los horarios
  const checkForConflicts = (day, newRange) => {
    const daySchedules = schedule[day];
    for (let i = 0; i < daySchedules.length; i++) {
      const [start, end] = daySchedules[i];
      const [newStart, newEnd] = newRange;
      if (
        (newStart.isAfter(start) || newStart.isSame(start)) && newStart.isBefore(end) ||
        (newEnd.isAfter(start) && (newEnd.isBefore(end) || newEnd.isSame(end)))
      ) {
        return true;
      }
    }
    return false;
  };

  // Manejar cambios en el rango de horarios con validación
  const handleRangeChangeWithValidation = (day, index, value) => {
    if (checkForConflicts(day, value)) {
      message.error('Los horarios no deben solaparse');
      return;
    }
    handleRangeChange(day, index, value);
  };

  // Evitar la propagación del evento de desplazamiento
  const handleScrollClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Form layout='vertical' onFinish={onFinish} initialValues={initialValues}>
      <h1 className="card-title mt-3">Información Personal</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} md={24} lg={8}>
          <Form.Item label='Nombre' name='firstName' rules={[{ required: true, message: 'Por favor, ingrese su nombre' }]}>
            <Input placeholder='Nombre' />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} md={24} lg={8}>
          <Form.Item label='Apellidos' name='lastName' rules={[{ required: true, message: 'Por favor, ingrese sus apellidos' }]}>
            <Input placeholder='Apellidos' />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} md={24} lg={8}>
          <Form.Item label='Teléfono' name='phoneNumber' rules={[{ required: true, message: 'Por favor, ingrese su teléfono' }]}>
            <Input placeholder='Teléfono' />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} md={24} lg={8}>
          <Form.Item label='Sitio web' name='website' rules={[{ required: true, message: 'Por favor, ingrese su sitio web' }]}>
            <Input placeholder='Sitio web' />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} md={24} lg={8}>
          <Form.Item label='Dirección' name='address' rules={[{ required: true, message: 'Por favor, ingrese su dirección' }]}>
            <Input placeholder='Dirección' />
          </Form.Item>
        </Col>
      </Row>
      <hr />
      <h1 className="card-title mt-3">Información Profesional</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} md={24} lg={8}>
          <Form.Item label='Especialización' name='specialization' rules={[{ required: true, message: 'Por favor, seleccione su especialización' }]}>
            <Select placeholder="Seleccionar especialización">
              {specialties.map(specialty => (
                <Option key={specialty} value={specialty}>{specialty}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} md={24} lg={8}>
          <Form.Item label='Experiencia' name='experience' rules={[{ required: true, message: 'Por favor, ingrese su experiencia' }]}>
            <Input placeholder='Experiencia' type='number' />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} md={24} lg={8}>
          <Form.Item label='Tarifa por consulta' name='feePerConsultation' rules={[{ required: true, message: 'Por favor, ingrese su tarifa por consulta' }]}>
            <Input placeholder='Tarifa por consulta' type='number' />
          </Form.Item>
        </Col>
      </Row>
      <hr />
      <h1 className="card-title mt-3">Horarios de atención</h1>
      <Collapse>
        {Object.keys(schedule).map((day) => (
          <Panel header={day} key={day}>
            <div className="schedules-wrapper">
              {schedule[day].map((range, index) => (
                <div className="schedule-item" key={index}>
                  <Form.Item label={`Horario ${index + 1}`} rules={[{ required: true, message: 'Por favor, ingrese el horario' }]}>
                    <RangePicker
                      format="HH:mm"
                      value={range}
                      disabled={range[0] && range[1]} // Deshabilitar si el rango es existente
                      placeholder={range[0] && range[1] ? [] : ['Hora inicial', 'Hora final']} // Mostrar placeholder solo si es nuevo
                      onChange={(values) => handleRangeChangeWithValidation(day, index, values)}
                    />
                  </Form.Item>
                  <Button type="danger" onClick={() => handleDeleteRange(day, index)}>Eliminar</Button>
                </div>
              ))}
              <Button type="dashed" onClick={() => handleAddRange(day)}>Agregar horario para {day}</Button>
            </div>
          </Panel>
        ))}
      </Collapse>
      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit" className="submit-button">Enviar</Button>
      </Form.Item>
    </Form>
  );
};

export default DentistForm;
