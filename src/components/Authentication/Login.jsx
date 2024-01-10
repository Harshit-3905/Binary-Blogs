import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const LoginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (email === "" || password === "") {
      setLoading(false);
      return toast.error("Please Fill All The Fields");
    }
    const data = {
      email,
      password,
    };
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(login(userData));
          toast.success("Login Successful");
          setLoading(false);
          navigate("/");
        }
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      if (error.message === "Invalid email or password") {
        toast.error("Password is incorrect");
      } else {
        toast.error(error.message);
      }
    }
    setLoading(false);
  };
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
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
            className="p-2 mt-5 bg-green-500 w-[100px] rounded-3xl text-white"
            type="submit"
            onClick={LoginHandler}
            disabled={loading}
          >
            {loading ? "Loading" : "Login"}
          </button>
        </div>
      </form>
      <p className="mt-5">
        Don&apos;t Have An Account ?{" "}
        <Link to="/auth/signup" className="text-red-600">
          SignUp
        </Link>
      </p>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
};

export default Login;
