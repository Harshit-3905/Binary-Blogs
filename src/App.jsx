import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, useEffect, useState } from "react";
import "./App.css";
import { Header, Footer } from "./components/index";
import { Outlet } from "react-router-dom";
import authService from "./appwrite/auth";
import { useDispatch } from "react-redux";
import { login } from "./store/authSlice";
import LoadingPage from "./pages/LoadingPage";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(login(userData));
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    checkUser();
  }, [dispatch]);
  if (loading)
    return (
      <div className="w-full h-screen bg-[#ADE8F4]">
        <LoadingPage />
      </div>
    );
  return (
    <div className="w-full h-screen">
      <Header />
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-[#ADE8F4]">
        <Suspense fallback={<LoadingPage />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
}

export default App;
