import { Editor } from "@tinymce/tinymce-react";
import config from "../config/config";
import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/service";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const AddBlogPage = ({ post }) => {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.$id || "");
  const [content, setContent] = useState(post?.content || "");
  const [image, setImage] = useState(post?.featuredImage || null);
  const [status, setStatus] = useState(post?.status || "public");
  const [loading, setLoading] = useState(false);
  const userID = useSelector((state) => state.auth.userData);
  const slugTransform = useCallback((slug) => {
    if (!post && slug) setSlug(slug.toLowerCase().replace(/\s+/g, "-"));
  }, []);
  const navigate = useNavigate();
  const SubmitHandler = async () => {
    setLoading(true);
    if (title === "" || content === "") {
      toast.error("Please Fill All The Fields");
      return;
    }
    try {
      const fileID = await appwriteService.uploadFile(image);
      const data = {
        title,
        slug,
        content,
        featuredImage: fileID.$id,
        status,
        userID,
      };
      const blog = await appwriteService.createPost(data);
      if (blog) {
        toast.success("Blog Added Successfully");
        navigate("/blog/" + slug);
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  const updateHandler = async () => {
    setLoading(true);
    if (title === "" || slug === "" || content === "" || image === null) {
      toast.error("Please Fill All The Fields");
      setLoading(false);
      return;
    }
    try {
      const data = {
        title,
        content,
        status,
      };
      if (image !== post.featuredImage) {
        await appwriteService.deleteFile(post.featuredImage);
        const fileID = await appwriteService.uploadFile(image);
        data.featuredImage = fileID.$id;
      } else {
        data.featuredImage = post.featuredImage;
      }
      const blog = await appwriteService.updatePost(post.$id, data);
      if (blog) {
        toast.success("Blog Updated Successfully");
        navigate("/blog/" + slug);
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (!post && title === "") setSlug("");
    else slugTransform(title);
  }, [title, slugTransform]);

  if (userID) {
    return (
      <div className="w-[90%] md:w-[70%] min-h-[85vh] flex flex-col justify-center py-10">
        <label htmlFor="title" className=" ml-2 text-xl">
          Title :
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          placeholder="Enter Title"
          className="rounded-2xl p-2 my-3"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label htmlFor="slug" className=" ml-2 text-xl">
          Slug :
        </label>
        <input
          type="text"
          name="slug"
          id="slug"
          value={slug}
          placeholder=""
          className="rounded-2xl p-2 my-3"
          disabled
        />
        <label htmlFor="image" className=" ml-2 text-xl">
          Image :
        </label>
        <input
          type="file"
          name="image"
          id="image"
          className="p-2 my-3"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="content" className="my-3 ml-2 text-xl">
          Content :
        </label>
        <Editor
          id="content"
          value={content}
          apiKey={config.tinymceAPIKey}
          onEditorChange={(value) => setContent(value)}
          init={{
            branding: false,
            height: 500,
            menubar: true,
            plugins: [
              "image",
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
              "anchor",
            ],
            toolbar:
              "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
        <div>
          <label htmlFor="status" className="mt-5 ml-2 text-xl">
            Status :{" "}
          </label>
          <select
            name="status"
            id="status"
            className="my-3"
            value={status}
            onChange={(e) => {
              console.log(e.target.value);
              setStatus(e.target.value);
            }}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="flex justify-center">
          {post ? (
            <button
              className="bg-green-800 text-white rounded-2xl p-2 my-5 w-24 justify-center"
              onClick={updateHandler}
              disabled={loading}
            >
              {loading ? "Loading" : "Update"}
            </button>
          ) : (
            <button
              className="bg-green-800 text-white rounded-2xl p-2 my-5 w-24 justify-center"
              onClick={SubmitHandler}
              disabled={loading}
            >
              {loading ? "Loading" : "Submit"}
            </button>
          )}
        </div>
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
  } else {
    return (
      <div className="text-4xl font-bold h-[85vh] flex items-center justify-center">
        Login to Add Blogs
      </div>
    );
  }
};

AddBlogPage.propTypes = {
  post: PropTypes.shape({
    $id: PropTypes.string,
    title: PropTypes.string,
    slug: PropTypes.string,
    image: PropTypes.string,
    content: PropTypes.string,
    status: PropTypes.string,
    featuredImage: PropTypes.string,
  }),
};

export default AddBlogPage;
