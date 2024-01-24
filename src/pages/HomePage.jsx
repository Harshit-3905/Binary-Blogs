import homebackground from "../assets/homebackground.webp";

const HomePage = () => {
  return (
    <div
      className="w-full h-[95vh] md:h-[85vh] md:min-h-[85vh] flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${homebackground})`,
        load: "lazy",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-[90%] md:w-[60%] mt-10 p-5 md:p-10 flex flex-col items-center justify-center rounded-3xl bg-[#48CAE4]">
        <h1 className="text-2xl md:text-4xl pb-5 font-medium">
          Welcome to Binary Blogs
        </h1>
        <div className="text-md md:text-xl text-center">
          <p>
            We offer a wide range of blogs on interview preparation, coding, and
            technology to help you advance your career.
          </p>
          <p>
            <strong>Interview preparation:</strong> Tips and tricks for
            interview rounds.
          </p>
          <p>
            <strong>Coding:</strong> Programming languages, algorithms, data
            structures, and more.
          </p>
          <p>
            <strong>Technology:</strong> The latest trends in tech, industry
            news, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
