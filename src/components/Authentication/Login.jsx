import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";

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
      toast.error("Please Fill All The Fields");
      return;
    }
    if (password.length < 8) {
      setLoading(false);
      toast.error("Password must be atleast 8 characters long");
      return;
    }
    const data = {
      email,
      password,
    };
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        toast.success("Login Successful");
        if (userData) {
          dispatch(login(userData));
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

  const LoginWithGoogle = async () => {
    try {
      authService.loginWithGoogle().then((userData) => {
        if (userData) {
          dispatch(login(userData));
          navigate("/");
          toast.success("Login Successfull!");
        }
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const GetGuestCredentials = async (e) => {
    e.preventDefault();
    setEmail("guest@example.com");
    setPassword("Guest@123");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">
        Login to Your Account
      </h2>
      <form className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            value={email}
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            value={password}
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-4">
          <button
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="submit"
            onClick={LoginHandler}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <button
            onClick={GetGuestCredentials}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Get Guest Credentials
          </button>
          <button
            onClick={LoginWithGoogle}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Login with Google
          </button>
        </div>
      </form>
      <p className="mt-8 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          to="/auth/signup"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign up
        </Link>
      </p>
      <ToastContainer />
    </div>
  );
};

export default Login;
