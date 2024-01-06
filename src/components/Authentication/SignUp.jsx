import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPasswrod] = useState("");
  const navigate = useNavigate();
  const RegisterHandler = (e) => {
    const data = { email, password, name };
    e.preventDefault();
    authService
      .createAccount(data)
      .then((res) => {
        console.log(res);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-blue-400">
      <form className="flex flex-col w-[70%] text-xl">
        <label htmlFor="name" className="mt-5 pl-1">
          Enter Full Name :
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter your Email"
          className="mt-2 rounded-2xl p-2 "
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="email" className="mt-5 pl-1">
          Email :
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your Email"
          className="mt-2 rounded-2xl p-2 "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password" className="mt-5 pl-1">
          Password :
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your Password"
          className="mt-2 rounded-2xl p-2 "
          value={password}
          onChange={(e) => setPasswrod(e.target.value)}
        />
        <div className="flex justify-center">
          <button
            className="p-2 mt-5 bg-green-700 w-[100px] rounded-3xl "
            type="submit"
            onClick={RegisterHandler}
          >
            Sign Up
          </button>
        </div>
      </form>
      <p className="mt-5">
        Already Have An Account ?{" "}
        <Link to="/auth/login" className="text-red-600">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
