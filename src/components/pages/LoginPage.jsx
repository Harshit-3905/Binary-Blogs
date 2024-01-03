// import Login from "../miscellaneous/Login";
import SignUp from "../miscellaneous/SignUp";

const LoginPage = () => {
  return (
    <div className="w-[80%] min-h-[70vh] bg-slate-400 flex rounded-3xl">
      <div className="w-[50%] flex items-center justify-center p-10">
        Quill Image
      </div>
      <div className="w-[50%] p-10 h-[100%]">
        {/* <Login /> */}
        <SignUp />
      </div>
    </div>
  );
};

export default LoginPage;
