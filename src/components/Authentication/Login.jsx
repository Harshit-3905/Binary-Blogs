import Input from "../Common/Input";

const Login = () => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-blue-400">
      <form className="flex flex-col w-[70%] text-xl ">
        <label htmlFor="email" className="mt-5">
          Email :
        </label>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your Email"
          className=""
        />
        <label htmlFor="password" className="mt-5">
          Password :
        </label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your Password"
          className=""
        />
        <div className="flex justify-center">
          <button
            className="p-2 mt-5 bg-green-700 w-[100px] rounded-3xl "
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
