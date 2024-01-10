import { Link, NavLink } from "react-router-dom";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import logo from "../../assets/Logo.png";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const LogoutHandler = () => {
    authService.logout();
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
    <div className="w-full h-[10vh] bg-[#48CAE4] flex items-center justify-between px-10">
      <div className="h-full p-2">
        <Link to="/">
          <img
            src={logo}
            alt="Binary Blogs"
            className="h-full bg-transparent"
          />
        </Link>
      </div>
      <div className="w-[400px]">
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
                } text-xl hover:text-[#03045E]`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </ul>
      </div>
      {authStatus ? (
        <button
          className="h-12 w-32 bg-red-600 p-3 rounded-xl text-white"
          onClick={LogoutHandler}
        >
          LogOut
        </button>
      ) : (
        <Link to="/auth/login">
          <button className="h-12 w-32 bg-red-600 p-3 rounded-xl text-white">
            Login/SignUp
          </button>
        </Link>
      )}
    </div>
  );
};

export default Header;
