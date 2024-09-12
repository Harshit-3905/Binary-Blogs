import { useState, useEffect } from "react";
import appwriteService from "../../appwrite/service";
import { Link } from "react-router-dom";
import { BlogCard, BlogCardLoading } from "..";

const TrendingBlogs = () => {
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      await appwriteService.getTrendingBlogs().then((res) => {
        if (res.documents) setTrendingBlogs(res.documents);
      });
      setLoading(false);
    }
    getData();
  }, []);
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

export default TrendingBlogs;
