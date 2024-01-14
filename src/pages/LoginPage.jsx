import { Outlet } from "react-router-dom";
import image from "../assets/auth.png";

const LoginPage = () => {
  return (
    <div className="w-[80%] min-h-[70vh] flex rounded-3xl">
      <div className="w-[50%] h-[80%] flex items-center justify-center ">
        <img src={image} alt="" height="300px" />
      </div>
      <div className="w-[50%] flex justify-center items-center p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default LoginPage;
