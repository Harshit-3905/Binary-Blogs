import { useParams } from "react-router-dom";
import appwriteService from "../appwrite/service";
import { useState, useEffect } from "react";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import LikeContainer from "../components/miscellaneous/Like.jsx";
import {
  EyeIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
} from "@primer/octicons-react";

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

  if (!post) return <LoadingPage />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <img
        src={appwriteService.getFilePreview(post.featuredImage)}
        alt={post.title}
        className="w-full h-[400px] object-fill rounded-lg shadow-md mb-8"
      />
      <h1 className="text-4xl font-bold mb-4 text-gray-800">{post.title}</h1>
      <div className="flex items-center text-gray-600 mb-6">
        <CalendarIcon size={16} className="mr-2" />
        <span className="mr-4">Published on {post.published_on}</span>
        <EyeIcon size={16} className="mr-2" />
        <span>{post.view_count} views</span>
      </div>
      <div className="prose max-w-none mb-8">{parse(post.content)}</div>
      <div className="flex items-center justify-between border-t border-b border-black py-4 mb-8">
        <div className="flex items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${post.author}&background=random`}
            alt={post.author}
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="font-medium text-gray-800">By {post.author}</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={likeHandler}
            className="flex items-center mr-4 focus:outline-none"
          >
            <LikeContainer liked={post.likes.includes(userData)} />
            <span className="ml-2">{post.likes_count}</span>
          </button>
        </div>
      </div>
      {userData && userData === post.userID && (
        <div className="flex justify-end space-x-4 mb-8">
          <Link
            to={`/blog/${slug}/edit`}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            <PencilIcon size={16} className="mr-2" />
            Edit
          </Link>
          <button
            onClick={deleteHandler}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          >
            <TrashIcon size={16} className="mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
