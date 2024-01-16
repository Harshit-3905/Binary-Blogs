import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPasswrod] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const RegisterHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (name === "" || email === "" || password === "") {
      setLoading(false);
      toast.error("Please Fill All The Fields");
      return;
    }
    if (password.length < 8) {
      setLoading(false);
      toast.error("Password must be atleast 8 characters long");
      return;
    }
    const data = { email, password, name };
    try {
      const session = await authService.createAccount(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        toast.success("Account Created Successfully");
        if (userData) dispatch(login(userData));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
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
            className="p-2 mt-5 bg-green-500 w-[100px] rounded-3xl text-white"
            type="submit"
            onClick={RegisterHandler}
            disabled={loading}
          >
            {loading ? "Loading" : "Sign Up"}
          </button>
        </div>
      </form>
      <p className="mt-5">
        Already Have An Account ?{" "}
        <Link to="/auth/login" className="text-red-600">
          Login
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

export default SignUp;
