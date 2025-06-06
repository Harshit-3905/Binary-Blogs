import { useState, useEffect } from "react";
import { BlogCard } from "../components";
import { BlogCardLoading } from "../components";
import appwriteService from "../appwrite/service";
import { Query } from "appwrite";
import { useDispatch, useSelector } from "react-redux";
import { populateBlogs } from "../store/blogSlice.js";

const AllBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userID = useSelector((state) => state.auth.userData);
  const blogsData = useSelector((state) => state.blogs);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      await appwriteService
        .getBlogs([Query.equal("status", ["public"])])
        .then((res) => {
          setBlogs(res.documents);
          dispatch(populateBlogs(res.documents));
        });
      setLoading(false);
    }
    if (blogsData.status) {
      setBlogs(blogsData.blogs);
      setLoading(false);
    } else {
      getData();
    }
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
            <BlogCard
              key={blog.$id}
              id={blog.$id}
              title={blog.title}
              image={appwriteService.getFile(blog.featuredImage)}
              content={blog.content}
              likes_count={blog.likes_count}
              liked={blog.likes.includes(userID)}
              view_count={blog.view_count}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AllBlogPage;
