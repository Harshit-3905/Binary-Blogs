import { Editor } from "@tinymce/tinymce-react";
import config from "../config/config";
import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

const AddBlogPage = ({ post }) => {
  const [title, setTitle] = useState(post?.title, "");
  const [slug, setSlug] = useState(post?.slug, "");
  const [content, setContent] = useState(post?.content, "");
  const slugTransform = useCallback((slug) => {
    if (slug) setSlug(slug.toLowerCase().replace(/\s+/g, "-"));
  }, []);
  useEffect(() => {
    if (title === "") setSlug("");
    else slugTransform(title);
  }, [title, slugTransform]);
  return (
    <div className="w-[80%] h-full flex flex-col justify-center py-10">
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
        placeholder=""
        className="p-2 my-3"
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
            "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <div className="flex justify-center">
        {post ? (
          <button className="bg-green-800 text-white rounded-2xl p-2 my-5 w-24 justify-center">
            Update
          </button>
        ) : (
          <button className="bg-green-800 text-white rounded-2xl p-2 my-5 w-24 justify-center">
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

AddBlogPage.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    slug: PropTypes.string,
    content: PropTypes.string,
  }),
};

export default AddBlogPage;
