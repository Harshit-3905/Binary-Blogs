import { useParams } from "react-router-dom";
import appwriteService from "../appwrite/service";
import { useState, useEffect } from "react";
import parse from "html-react-parser";

const BlogPage = () => {
  const slug = useParams().slug;
  const [post, setPost] = useState(null);
  useEffect(() => {
    async function getData() {
      setPost(await appwriteService.getPost(slug));
    }
    getData();
  });
  if (post)
    return (
      <div className="w-[80%] flex flex-col items-center justify-center">
        <div className="w-[600px] mt-10">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={slug}
          />
        </div>
        <h1 className="text-3xl font-bold mt-10">{post.title}</h1>
        <div className="text-xl mt-10">{parse(post.content)}</div>
      </div>
    );
  else return <div>Loading...</div>;
};

export default BlogPage;
