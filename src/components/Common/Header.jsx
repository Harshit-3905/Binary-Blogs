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
      name: "Write Blog",
      link: "/writeblogs",
    },
  ];
  return (
    <div className="w-full h-[10vh] bg-white text-black flex items-center justify-between px-10">
      <div>Quill Tech</div>
      <div className="w-[300px]">
        <ul className="flex justify-evenly">
          {NavItems.map((item) => (
            <li key={item.name}>{item.name}</li>
          ))}
        </ul>
      </div>
      <div>Login/SignUp</div>
    </div>
  );
};

export default Header;
