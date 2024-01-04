import { BlogCard } from "../components";

const BlogPage = () => {
  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-[80%] flex flex-wrap justify-center gap-10 p-8">
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
      </div>
    </div>
  );
};

export default BlogPage;
