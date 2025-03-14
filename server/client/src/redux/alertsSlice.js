import { createSlice } from '@reduxjs/toolkit';

// Creación del slice para el manejo de alertas
export const alertsSlice = createSlice({
  name: 'alerts',
  initialState: { loading: false },
  reducers: {
    // Acción para mostrar la carga
    showLoading: (state) => {
      state.loading = true;
    },
    // Acción para ocultar la carga
    hideLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { showLoading, hideLoading } = alertsSlice.actions;
export default alertsSlice.reducer;
