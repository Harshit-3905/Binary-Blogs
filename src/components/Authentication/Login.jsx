import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { toast } from "react-toastify";

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
      toast.error("Password must be at least 8 characters long");
      return;
    }
    const data = {
      email,
      password,
    };
    await LoginUser(data);
    setLoading(false);
  };

  const GetGuestCredentials = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmail("guest@example.com");
    setPassword("Guest@123");
    const data = {
      email: "guest@example.com",
      password: "Guest@123",
    };
    await LoginUser(data);
    setLoading(false);
  };

  const LoginUser = async (data) => {
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
            placeholder="Enter your Email"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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
            placeholder="Enter your Password"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <button
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={LoginHandler}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <button
            onClick={GetGuestCredentials}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
            disabled={loading}
          >
            Login With Guest Credentials
          </button>
        </div>
      </form>
      <p className="mt-8 text-center text-md text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          to="/auth/signup"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
