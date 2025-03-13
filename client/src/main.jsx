import { createRoot } from 'react-dom/client';
import './index.css';
import 'antd/dist/reset.css';
import { Provider } from 'react-redux'; 
import App from './App.jsx'; 
import store from './redux/store';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');
// Renderizar el componente App en el contenedor con el id 'root'
// Proveedor envuelve la aplicación para que funcione con Redux
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
