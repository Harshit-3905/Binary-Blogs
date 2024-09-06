import homebackground from "../../assets/homebackground.webp";

const HeroSection = () => {
  return (
    <div
      className="w-full h-[90vh] flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${homebackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-[90%] lg:w-[60%] mt-10 p-5 md:p-10 flex flex-col items-center justify-center rounded-3xl backdrop-blur-xl">
        <h1 className="text-2xl md:text-4xl pb-5 font-medium ">
          Welcome to Binary Blogs
        </h1>
        <div className="text-md md:text-xl text-center font-medium">
          Explore a vast collection of blogs on interview prep, coding, and
          technology to boost your career and share your own insights with the
          community.
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
