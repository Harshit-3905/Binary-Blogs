import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  name: null,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.status = true;
      state.name = action.payload.name;
      state.userData = action.payload.$id;
    },
    logout(state) {
      state.status = false;
      state.name = null;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
