import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";

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
  const SignWithGoogle = async () => {
    try {
      const session = await authService.loginWithGoogle();
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          toast.success("Login Successful");
          dispatch(login(userData));
        }
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
            className="p-2 mt-5 bg-green-500 w-[200px] rounded-3xl text-white"
            type="submit"
            onClick={RegisterHandler}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  aria-hidden="true"
                  className="w-7 text-gray-200 animate-spin fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
      </form>
      <button
        onClick={SignWithGoogle}
        className="p-2 mt-4 bg-green-500 w-[200px] rounded-3xl text-white text-md flex gap-2"
      >
        <FcGoogle size={30} />
        <span>SignUp with Google</span>
      </button>
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
