import { useParams } from "react-router-dom";
import appwriteService from "../appwrite/service";
import { useState, useEffect } from "react";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import LikeContainer from "../components/miscellaneous/Like.jsx";

const BlogPage = () => {
  const slug = useParams().slug;
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const likeHandler = async () => {
    try {
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
  const userData = useSelector((state) => state.auth.userData);
  useEffect(() => {
    async function getData() {
      setPost(await appwriteService.getPost(slug));
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
        <div className="w-[80%] text-xl my-10">{parse(post.content)}</div>
        <div
          className="flex justify-center items-center gap-2 text-lg pb-2"
          onClick={likeHandler}
        >
          <LikeContainer liked={post.likes.includes(userData)} />{" "}
          {post.likes_count}
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
