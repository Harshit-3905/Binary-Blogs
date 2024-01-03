import BlogCard from "../miscellaneous/BlogCard";

const BlogPage = () => {
  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-[80%] flex flex-wrap gap-10 p-8">
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
