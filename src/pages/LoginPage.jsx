import { Outlet } from "react-router-dom";
import image from "../assets/auth.png";

const LoginPage = () => {
  return (
    <div className="w-full min-h-[50vh] md:h-full flex rounded-3xl flex-col lg:flex-row">
      <div className="w-full h-[50%] flex items-center justify-center">
        <img src={image} alt="" height="300px" loading="lazy" />
      </div>
      <div className="w-full h-[50%] flex justify-center items-center p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default LoginPage;
