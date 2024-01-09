import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const LoginHandler = (e) => {
    e.preventDefault();
    const data = { email, password };
    authService
      .login(data)
      .then(() => {
        navigate("/");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-blue-400">
      <form className="flex flex-col w-[70%] text-xl ">
        <label htmlFor="email" className="mt-5">
          Email :
        </label>
        <input
          value={email}
          type="email"
          name="email"
          id="email"
          placeholder="Enter your Email"
          className="mt-2 rounded-2xl p-2 "
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password" className="mt-5">
          Password :
        </label>
        <input
          value={password}
          type="password"
          name="password"
          id="password"
          placeholder="Enter your Password"
          className="mt-2 rounded-2xl p-2 "
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-center">
          <button
            className="p-2 mt-5 bg-green-700 w-[100px] rounded-3xl "
            type="submit"
            onClick={LoginHandler}
          >
            Login
          </button>
        </div>
      </form>
      <p className="mt-5">
        Don&apos;t Have An Account ?{" "}
        <Link to="/auth/signup" className="text-red-600">
          SignUp
        </Link>
      </p>
    </div>
  );
};

export default Login;
