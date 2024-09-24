import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import appwriteService from "../../appwrite/service";
import { Link } from "react-router-dom";
import { BlogCard, BlogCardLoading } from "..";
import { setTrendingBlogs } from "../../store/blogSlice";

const TrendingBlogs = () => {
  const dispatch = useDispatch();
  const { trendingBlogs } = useSelector((state) => state.blogs);
  const [loading, setLoading] = useState(false);

  async function getData() {
    setLoading(true);
    const res = await appwriteService.getTrendingBlogs();
    if (res.documents) {
      dispatch(setTrendingBlogs(res.documents));
    }
    setLoading(false);
  }
  useEffect(() => {
    if (trendingBlogs.length === 0) {
      getData();
    }
  }, [trendingBlogs, dispatch]);

  return (
    <div className="w-full py-16">
      <h2 className="text-3xl font-bold mb-8 text-center underline underline-offset-4">
        Trending Blogs
      </h2>
      <div className="w-full flex flex-wrap justify-center items-center gap-10 p-8">
        {loading ? (
          <>
            <BlogCardLoading />
            <BlogCardLoading />
            <BlogCardLoading />
            <BlogCardLoading />
          </>
        ) : trendingBlogs.length === 0 ? (
          <h1 className="text-4xl font-bold flex items-center justify-center">
            No Blogs to Display
          </h1>
        ) : (
          trendingBlogs.map((blog) => (
            <Link key={blog.$id} to={`/blog/${blog.$id}`}>
              <BlogCard
                id={blog.$id}
                title={blog.title}
                image={appwriteService.getFilePreview(blog.featuredImage)}
                content={blog.content}
                likes_count={blog.likes_count}
                liked={blog.liked}
                view_count={blog.view_count}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TrendingBlogs;
