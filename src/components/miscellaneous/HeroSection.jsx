import { Link } from "react-router-dom";
import homebackground from "../../assets/homebackground.webp";

const HeroSection = () => {
  return (
    <div
      className="w-full h-[90vh] flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${homebackground})` }}
    >
      <div className="w-[90%] lg:w-[60%] mt-10 p-8 md:p-12 flex flex-col items-center justify-center rounded-3xl backdrop-blur-xl bg-white/30">
        <h1 className="text-3xl md:text-5xl pb-6 font-bold text-gray-800 text-center">
          Welcome to Binary Blogs
        </h1>
        <p className="text-lg md:text-xl text-center font-medium text-gray-700 max-w-2xl mb-8">
          Explore a vast collection of blogs on interview prep, coding, and
          technology to boost your career and share your own insights with the
          community.
        </p>
        <Link
          to="/blogs"
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300"
        >
          Explore Blogs
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
