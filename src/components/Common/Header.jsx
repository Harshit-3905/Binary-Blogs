import { Link, NavLink } from "react-router-dom";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import logo from "../../assets/Logo.png";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { ThreeBarsIcon, XIcon } from "@primer/octicons-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const LogoutHandler = () => {
    authService.logout();
    toast.success("Logout Successful");
    dispatch(logout());
    navigate("/");
  };
  const NavItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Blogs",
      link: "/blogs",
    },
    {
      name: "Add Blog",
      link: "/addblog",
    },
  ];
  return (
    <>
      <div className="w-[100vw] h-[10vh] bg-[#48CAE4] flex items-center justify-between px-10">
        <div className="h-full p-2">
          <Link to="/">
            <img
              src={logo}
              alt="Binary Blogs"
              className="h-full bg-transparent"
            />
          </Link>
        </div>
        <div className="hidden lg:inline-block w-[400px]">
          <ul className="flex justify-evenly">
            {NavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.link}
                className={({ isActive }) =>
                  `block py-2 pr-4 pl-3 duration-200 ${
                    isActive
                      ? "underline underline-offset-4 text-[#03045E]"
                      : "no-underline"
                  } text-xl hover:text-[#03045E] font-medium`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </ul>
        </div>
        {authStatus ? (
          <button
            className="hidden lg:inline h-12 w-32 bg-red-600 p-3 rounded-xl text-white"
            onClick={LogoutHandler}
          >
            LogOut
          </button>
        ) : (
          <Link to="/auth/login">
            <button className="hidden lg:inline h-12 w-32 bg-red-600 p-3 rounded-xl text-white">
              Login/SignUp
            </button>
          </Link>
        )}
        <button
          className="lg:hidden h-12 w-12 p-3 rounded-xl text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <XIcon size={24} /> : <ThreeBarsIcon size={24} />}
        </button>
      </div>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } lg:hidden w-[100vw] bg-[#48CAE4] flex flex-col items-center justify-center`}
      >
        <ul className="flex flex-col justify-evenly">
          {NavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.link}
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 ${
                  isActive
                    ? "underline underline-offset-4 text-[#03045E]"
                    : "no-underline"
                } text-xl hover:text-[#03045E] font-medium`
              }
            >
              {item.name}
            </NavLink>
          ))}
          {authStatus ? (
            <li
              className="block py-2 pr-4 pl-3 duration-200 text-xl hover:text-[#03045E] font-medium"
              onClick={LogoutHandler}
            >
              LogOut
            </li>
          ) : (
            <Link to="/auth/login">
              <li className="block py-2 pr-4 pl-3 duration-200 text-xl hover:text-[#03045E] font-medium">
                Login/SignUp
              </li>
            </Link>
          )}
        </ul>
      </div>
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
    </>
  );
};

export default Header;
