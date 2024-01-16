import { useState, useEffect } from "react";
import { BlogCard } from "../components";
import { BlogCardLoading } from "../components";
import appwriteService from "../appwrite/service";
import { Link } from "react-router-dom";

const AllBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    async function getData() {
      await appwriteService.getBlogs().then((res) => {
        setBlogs(res.documents);
      });
    }
    getData();
  }, []);

  return (
    <div className="w-full min-h-[85vh] flex justify-center">
      <div className="w-full flex flex-wrap justify-center items-center gap-10 p-8">
        {blogs.length === 0 ? (
          <>
            <BlogCardLoading />
            <BlogCardLoading />
            <BlogCardLoading />
            <BlogCardLoading />
          </>
        ) : (
          blogs.map((blog) => (
            <Link key={blog.$id} to={`/blog/${blog.$id}`}>
              <BlogCard
                title={blog.title}
                image={appwriteService.getFilePreview(blog.featuredImage)}
                content={blog.content}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default AllBlogPage;
