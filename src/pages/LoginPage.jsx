import { Outlet } from "react-router-dom";
import image from "../assets/auth.webp";
import { Suspense } from "react";
import LoadingPage from "./LoadingPage";
import { useSelector } from "react-redux";

const LoginPage = () => {
  const authStatus = useSelector((state) => state.auth.status);

  if (authStatus) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <p className="text-2xl font-semibold text-gray-700">
          You are already logged in
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="w-full lg:w-1/2 p-8 lg:p-16">
        <img
          src={image}
          alt="Authentication"
          className="w-full max-w-md mx-auto rounded-lg"
        />
      </div>
      <div className="w-full lg:w-1/2 p-8 lg:p-16">
        <Suspense fallback={<LoadingPage />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default LoginPage;
