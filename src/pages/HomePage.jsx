// import { BlogCard } from "../components/index";

const HomePage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-[80%] h-[300px] mt-10 bg-[#00B4D8] flex flex-col items-center justify-center rounded-3xl">
        <h1 className="text-4xl p-5 font-medium">Welcome to Binary Blogs</h1>
        <div className="text-xl text-center">
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
      {/* <div className="w-[80%] bg-blue-500 mt-10 rounded-3xl flex flex-col items-center p-5 m-10">
        <h1 className="text-3xl">Recent Blogs</h1>
        <div className="w-full flex flex-row justify-center gap-5 mt-8">
          <BlogCard />
          <BlogCard />
          <BlogCard />
        </div>
      </div> */}
    </div>
  );
};

export default HomePage;
