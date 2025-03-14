import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Col, Row } from 'antd';
import Dentist from '../components/Dentist';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';

function Home() {
  const [dentists, setDentists] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get('/api/user/get-all-approved-dentists', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDentists(response.data.data);
      } else {
        console.error('Error obteniendo la lista de dentistas');
      }
    } catch (error) {
      console.error('Error obteniendo la lista de dentistas:', error);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (!user) {
    return <div>Cargando...</div>;
  }

  const welcomeMessage = `Bienvenido(a), ${user.name}!`;

  return (
    <Layout>
      {user.isAdmin || user.isDentist ? (
        <h1>{welcomeMessage}</h1>
      ) : (
        <Row gutter={20}>
          {dentists.map((dentist) => (
            <Col span={8} xs={24} sm={24} md={24} lg={8} key={dentist._id}>
              <Dentist dentist={dentist} />
            </Col>
          ))}
        </Row>
      )}
    </Layout>
  );
}

export default Home;
