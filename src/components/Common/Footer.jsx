import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="w-full h-[5vh] text-black bg-[#48CAE4] flex items-center justify-center px-5">
      <p className="text-xs md:text-lg text-center">
        &copy; 2024 . All Rigths Reserved. Made by{" "}
        <Link
          to="https://harshitjoshi.me/"
          className="text-blue-950 font-bold text-xs md:text-lg"
          target="_blank"
        >
          Harshit Joshi
        </Link>
      </p>
    </div>
  );
};

export default Footer;
