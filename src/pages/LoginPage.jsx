import { Outlet } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="w-[80%] min-h-[70vh] bg-slate-400 flex rounded-3xl">
      <div className="w-[50%] flex items-center justify-center p-10">
        Quill Image
      </div>
      <div className="w-[50%] bg-teal-700 flex justify-center items-center p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default LoginPage;
