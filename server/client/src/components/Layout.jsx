import React from 'react';
import '../layout.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from 'antd';
import { clearUser } from '../redux/userSlice';

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Menú del usuario
  const userMenu = [
    { name: 'Inicio', path: '/', icon: 'ri-home-line' },
    { name: 'Citas', path: '/appointments', icon: 'ri-file-list-line' },
    { name: 'Aplicar para ser Odontólogo', path: '/apply-dentist', icon: 'ri-hospital-line' },
  ];

  // Menú del administrador
  const adminMenu = [
    { name: 'Inicio', path: '/', icon: 'ri-home-line' },
    { name: 'Usuarios', path: '/admin/userslist', icon: 'ri-user-line' },
    { name: 'Odontólogos', path: '/admin/dentistslist', icon: 'ri-user-star-line' },
  ];

  // Menú del dentista
  const dentistMenu = [
    { name: 'Inicio', path: '/', icon: 'ri-home-line' },
    { name: 'Citas', path: '/appointments', icon: 'ri-file-list-line' },
    { name: 'Perfil', path: `/dentist/profile/${user?._id}`, icon: 'ri-user-line' },
  ];

  // Menú a ser renderizado basado en el rol del usuario
  const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDentist ? dentistMenu : userMenu;
  const role = user?.isAdmin ? "Admin" : user?.isDentist ? "Odontólogo" : "Usuario";

  return (
    <div className='main'>
      <div className='d-flex layout'>
        <div className='sidebar'>
          <div className='sidebar-header'>
            <h1 className='logo'>{collapsed ? 'DxC' : 'DentixCare'}</h1>
            <h1 className='role'>{role}</h1>
          </div>
          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div className={`d-flex menu-item ${isActive && 'active-menu-item'}`} key={menu.path}>
                  <i className={menu.icon}></i>
                  {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
            <div className='d-flex menu-item' onClick={() => {
              localStorage.clear();
              dispatch(clearUser()); // Limpiar el estado del usuario
              navigate('/login');
            }}>
              <i className='ri-logout-box-line'></i>
              {!collapsed && <Link to='/login'>Cerrar Sesión</Link>}
            </div>
          </div>
        </div>
        <div className='content'>
          <div className="header">
            {collapsed 
              ? <i className="ri-menu-2-fill header-action-icon" onClick={() => setCollapsed(false)}></i> 
              : <i className="ri-close-fill header-action-icon" onClick={() => setCollapsed(true)}></i>}
            <div className="d-flex align-items-center px-4">
              <Badge count={user?.unseenNotifications.length} onClick={() => navigate('/notifications')}>
                <i className="ri-notification-line header-action-icon px-3"></i>
              </Badge>
              <Link className='anchor mx-2' to='/profile'>{user?.name}</Link>
            </div>
          </div>
          <div className="body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;