// import { Login } from "../components";
import { SignUp } from "../components";

const LoginPage = () => {
  return (
    <div className="w-[80%] min-h-[70vh] bg-slate-400 flex rounded-3xl">
      <div className="w-[50%] flex items-center justify-center p-10">
        Quill Image
      </div>
      <div className="w-[50%] bg-teal-700 flex justify-center items-center p-10">
        {/* <Login /> */}
        <SignUp />
      </div>
    </div>
  );
};

export default LoginPage;
