import { BlogCard2 } from "../components/index";

const HomePage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-[80%] h-[300px] mt-10 bg-blue-500 flex flex-col items-center justify-center rounded-3xl">
        <h1 className="text-3xl">Welcome to Quill Quest</h1>
        <p>
          We offer a wide range of blogs on interview preparation, coding, and
          technology to help you advance your career.
        </p>
        <p>Interview preparation: Tips and tricks for interview rounds. </p>
        <p>
          Coding: Programming languages, algorithms, data structures, and more.
        </p>
        <p>Technology: The latest trends in tech, industry news, and more.</p>
      </div>
      <div className="w-[80%] bg-blue-500 mt-10 rounded-3xl flex flex-col items-center p-5 m-10">
        <h1 className="text-3xl">Recent Blogs</h1>
        <div className="w-full flex flex-col items-center justify-center gap-5 mt-8">
          <BlogCard2 />
          <BlogCard2 />
          <BlogCard2 />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
