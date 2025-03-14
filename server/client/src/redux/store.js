import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import alertsReducer from './alertsSlice';
import userReducer from './userSlice';

// Combinación de los reductores para crear el rootReducer
const rootReducer = combineReducers({
  alerts: alertsReducer,
  user: userReducer,
});

// Configuración y creación de la tienda de Redux
const store = configureStore({
  reducer: rootReducer,
});

export default store;
