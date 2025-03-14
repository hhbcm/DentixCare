import React from 'react';
import Layout from '../components/Layout';
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setUser } from '../redux/userSlice';

function Notifications() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Marcar todas las notificaciones como leídas
  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/user/mark-all-notifications-as-seen', {
        userId: user._id,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Algo salió mal');
    }
  };

  // Eliminar todas las notificaciones
  const deleteAll = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/user/delete-all-notifications', {
        userId: user._id,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Algo salió mal');
    }
  };

  return (
    <Layout>
      <h1 className="page-title">Notificaciones</h1>
      <Tabs>
        <Tabs.TabPane tab='No leídas' key={0}>
          <div className="d-flex justify-content-end">
            <h1 className='anchor' onClick={markAllAsSeen}>Marcar todas como leídas</h1>
          </div>
          {user?.unseenNotifications.map((notification) => (
            <div className='card p2' onClick={() => navigate(notification.onClickPath)} key={notification._id}>
              <div className='card-text'>{notification.message}</div>
            </div>
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane tab='Leídas' key={1}>
          <div className="d-flex justify-content-end">
            <h1 className='anchor' onClick={deleteAll}>Borrar todas</h1>
          </div>
          {user?.seenNotifications.map((notification) => (
            <div className='card p2' onClick={() => navigate(notification.onClickPath)} key={notification._id}>
              <div className='card-text'>{notification.message}</div>
            </div>
          ))}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
}

export default Notifications;
