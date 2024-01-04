import Input from "../Common/Input";

const SignUp = () => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-blue-400">
      <form className="flex flex-col w-[70%] text-xl">
        <label htmlFor="name" className="mt-5 pl-1">
          Enter Full Name :
        </label>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="Enter your Email"
        />
        <label htmlFor="email" className="mt-5 pl-1">
          Email :
        </label>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your Email"
        />
        <label htmlFor="password" className="mt-5 pl-1">
          Password :
        </label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your Password"
        />
        <div className="flex justify-center">
          <button
            className="p-2 mt-5 bg-green-700 w-[100px] rounded-3xl "
            type="submit"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
