import { useParams } from "react-router-dom";
import appwriteService from "../appwrite/service";
import { useState, useEffect } from "react";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import LikeContainer from "../components/miscellaneous/Like.jsx";
import { EyeIcon } from "@primer/octicons-react";

const BlogPage = () => {
  const slug = useParams().slug;
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const likeHandler = async () => {
    try {
      if (userData === null) {
        toast.error("Please Login to like the blog");
        return;
      }
      let updatedPost;
      if (post.likes.includes(userData)) {
        updatedPost = await appwriteService.removeLike(slug, userData);
        toast.success("Like Removed");
      } else {
        updatedPost = await appwriteService.addLike(slug, userData);
        toast.success("Blog Liked");
      }
      setPost(updatedPost);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const deleteHandler = async () => {
    try {
      await appwriteService.deletePost(slug);
      toast.success("Post deleted successfully");
      navigate("/blogs");
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    async function getData() {
      try {
        const getPost = await appwriteService.getPost(slug);
        if (!getPost) {
          console.log("Post not found with the provided slug");
          return;
        }
        const originalDateString = getPost.published_on;
        if (!originalDateString) {
          console.log("Published date is missing or invalid");
          return;
        }
        const dateObject = new Date(originalDateString);
        const day = dateObject.getUTCDate().toString().padStart(2, "0");
        const month = (dateObject.getUTCMonth() + 1)
          .toString()
          .padStart(2, "0");
        const year = dateObject.getUTCFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        getPost.published_on = formattedDate;
        setPost(getPost);
      } catch (error) {
        console.error("Error occurred while processing post:", error);
      }
    }
    getData();
  }, [slug]);
  if (post)
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <img
          src={appwriteService.getFilePreview(post.featuredImage)}
          alt={slug}
          className="w-[500px] h-[300px] mt-10"
        />
        <h1 className="text-3xl font-bold mt-10 ">{post.title}</h1>
        <h2 className="text-xl mt-5">
          - By <strong>{post.author}</strong>
        </h2>
        <h2 className="text-xl mt-5">
          - Published on <strong>{post.published_on}</strong>
        </h2>
        <div className="w-[80%] text-xl my-10">{parse(post.content)}</div>
        <div
          className="flex justify-center items-center gap-2 text-lg pb-2"
          onClick={likeHandler}
        >
          <LikeContainer liked={post.likes.includes(userData)} />{" "}
          {post.likes_count} <EyeIcon size={24} /> {post.view_count}
        </div>
        {userData && userData === post.userID && (
          <div className="flex my-10">
            <Link to={`/blog/${slug}/edit`}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Edit
              </button>
            </Link>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-10"
              onClick={deleteHandler}
            >
              Delete
            </button>
          </div>
        )}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"
        />
      </div>
    );
  else return <LoadingPage />;
};

export default BlogPage;
