import { createSlice } from '@reduxjs/toolkit';

// Creación del slice para el manejo del estado del usuario
export const userSlice = createSlice({
  name: 'user',
  initialState: { user: null },
  reducers: {
    // Acción para establecer el usuario
    setUser: (state, action) => {
      state.user = action.payload;
    },
    // Acción para limpiar el estado del usuario
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;