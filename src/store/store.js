import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import blogSlice from "./blogSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    blogs: blogSlice,
  },
});

export default store;
