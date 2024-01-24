import { Outlet } from "react-router-dom";
import image from "../assets/auth.webp";
import { Suspense } from "react";
import LoadingPage from "./LoadingPage";

const LoginPage = () => {
  return (
    <div className="w-full min-h-[50vh] md:h-full flex rounded-3xl flex-col lg:flex-row">
      <div className="w-full h-[50%] flex items-center justify-center">
        <img src={image} alt="" height="300px" loading="lazy" />
      </div>
      <div className="w-full h-[50%] flex justify-center items-center p-10">
        <Suspense fallback={<LoadingPage />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default LoginPage;
