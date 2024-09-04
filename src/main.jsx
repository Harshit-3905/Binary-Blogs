import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  RouterProvider,
  createRoutesFromElements,
  Route,
  createHashRouter,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { lazy } from "react";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const AllBlogPage = lazy(() => import("./pages/AllBlogPage.jsx"));
const AddBlogPage = lazy(() => import("./pages/AddBlogPage.jsx"));
const MyBlogPage = lazy(() => import("./pages/MyBlogPage.jsx"));
const BlogPage = lazy(() => import("./pages/BlogPage.jsx"));
const EditBlogPage = lazy(() => import("./pages/EditBlogPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const Login = lazy(() => import("./components/Authentication/Login.jsx"));
const SignUp = lazy(() => import("./components/Authentication/SignUp.jsx"));

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<HomePage />} />
      <Route path="blogs" element={<AllBlogPage />} />
      <Route path="addblog" element={<AddBlogPage />} />
      <Route path="myblogs" element={<MyBlogPage />} />
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
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
