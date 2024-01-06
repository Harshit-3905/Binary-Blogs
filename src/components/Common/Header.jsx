import { Link, NavLink } from "react-router-dom";

const Header = () => {
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
    <div className="w-full h-[10vh] bg-white text-black flex items-center justify-between px-10">
      <div>Quill Tech</div>
      <div className="w-[300px]">
        <ul className="flex justify-evenly">
          {NavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.link}
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 ${
                  isActive ? "text-orange-700" : "text-gray-700"
                } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </ul>
      </div>
      <Link to="/auth/login">
        <button className="h-12 w-32 bg-red-600 p-3 rounded-xl">
          Login/SignUp
        </button>
      </Link>
    </div>
  );
};

export default Header;
