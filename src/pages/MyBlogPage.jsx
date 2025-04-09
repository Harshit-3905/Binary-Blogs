import { useState, useEffect } from "react";
import appwriteService from "../appwrite/service";
import { BlogCardLoading, BlogCard } from "../components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Query } from "appwrite";

const MyBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const userID = useSelector((state) => state.auth.userData);
  useEffect(() => {
    async function getData() {
      setLoading(true);
      await appwriteService
        .getBlogs([Query.equal("userID", [userID])])
        .then((res) => {
          setBlogs(res.documents);
        });
      setLoading(false);
    }
    getData();
  }, []);
  return (
    <div className="w-full min-h-[85vh] flex justify-center">
      <div className="w-full flex flex-wrap justify-center items-center gap-10 p-8">
        {loading ? (
          <>
            <BlogCardLoading />
            <BlogCardLoading />
            <BlogCardLoading />
            <BlogCardLoading />
          </>
        ) : blogs.length === 0 ? (
          <h1 className="text-4xl font-bold flex items-center justify-center">
            No Blogs to Display
          </h1>
        ) : (
          blogs.map((blog) => (
            <Link key={blog.$id} to={`/blog/${blog.$id}`}>
              <BlogCard
                title={blog.title}
                image={appwriteService.getFile(blog.featuredImage)}
                content={blog.content}
                likes_count={blog.likes_count}
                liked={blog.likes.includes(userID)}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBlogPage;
