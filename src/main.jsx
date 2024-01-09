import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import AllBlogPage from "./pages/AllBlogPage.jsx";
import AddBlogPage from "./pages/AddBlogPage.jsx";
import EditBlogPage from "./pages/EditBlogPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import { Login, SignUp } from "./components";
import "./index.css";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<HomePage />} />
      <Route path="blogs" element={<AllBlogPage />} />
      <Route path="addblog" element={<AddBlogPage />} />
      <Route path="auth" element={<LoginPage />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
      <Route path="blog/:slug" element={<BlogPage />} />
      <Route path="blog/:slug/edit" element={<EditBlogPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
