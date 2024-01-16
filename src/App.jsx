import { useEffect } from "react";
import "./App.css";
import { Header, Footer } from "./components/index";
import { Outlet } from "react-router-dom";
import authService from "./appwrite/auth";
import { useDispatch } from "react-redux";
import { login } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(login(userData));
      } catch (error) {
        console.log(error);
      }
    };
    checkUser();
  }, []);
  return (
    <div className="w-screen h-screen">
      <Header />
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-[#ADE8F4]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
