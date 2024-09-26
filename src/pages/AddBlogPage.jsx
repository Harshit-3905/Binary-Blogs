import { Editor } from "@tinymce/tinymce-react";
import config from "../config/config";
import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PencilIcon, UploadIcon } from "@primer/octicons-react";

const AddBlogPage = ({ post }) => {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.$id || "");
  const [content, setContent] = useState(post?.content || "");
  const [image, setImage] = useState(post?.featuredImage || null);
  const [status, setStatus] = useState(post?.status || "public");
  const [loading, setLoading] = useState(false);
  const userID = useSelector((state) => state.auth.userData);
  const author = useSelector((state) => state.auth.name);
  const navigate = useNavigate();

  const slugTransform = useCallback(
    (value) => {
      if (!post && value) setSlug(value.toLowerCase().replace(/\s+/g, "-"));
    },
    [post]
  );

  useEffect(() => {
    if (!post && title === "") setSlug("");
    else slugTransform(title);
  }, [title, slugTransform, post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === "" || content.trim() === "") {
      toast.error("Please fill all the fields");
      return;
    }
    if (title.length > 36) {
      toast.error("Title should be less than 36 characters");
      return;
    }
    setLoading(true);
    try {
      const fileID =
        image instanceof File ? await appwriteService.uploadFile(image) : image;
      const data = {
        title,
        slug,
        content,
        featuredImage: fileID instanceof File ? fileID.$id : fileID,
        status,
        userID,
        author,
      };
      if (post) {
        const updatedPost = await appwriteService.updatePost(post.$id, data);
        if (updatedPost) {
          toast.success("Blog updated successfully");
          navigate(`/blog/${slug}`);
        }
      } else {
        const newPost = await appwriteService.createPost(data);
        if (newPost) {
          toast.success("Blog created successfully");
          navigate(`/blog/${slug}`);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  if (!userID) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <p className="text-2xl font-semibold text-black">
          Please Log in to Add Blogs
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 w-[95%] md:w-[80%] lg:w-[60%]">
      <h1 className="text-3xl font-bold mb-8">
        {post ? "Edit Blog" : "Create New Blog"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Blog Title"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100"
            disabled
          />
        </div>
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Featured Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Content
          </label>
          <Editor
            apiKey={config.tinymceAPIKey}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
            }}
            value={content}
            onEditorChange={(content) => setContent(content)}
          />
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? (
              "Processing..."
            ) : post ? (
              <>
                <PencilIcon size={16} className="mr-2" />
                Update Blog
              </>
            ) : (
              <>
                <UploadIcon size={16} className="mr-2" />
                Publish Blog
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

AddBlogPage.propTypes = {
  post: PropTypes.shape({
    $id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    featuredImage: PropTypes.string,
    status: PropTypes.string,
  }),
};

export default AddBlogPage;
