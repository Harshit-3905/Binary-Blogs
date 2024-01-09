import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import appwriteService from "../appwrite/service";
import AddBlogPage from "./AddBlogPage";

const EditBlogPage = () => {
  const [post, setPost] = useState([]);
  const slug = useParams().slug;
  useEffect(() => {
    async function getData() {
      setPost(await appwriteService.getPost(slug));
    }
    getData();
  }, []);
  if (post.length === 0) {
    return <div>Loading...</div>;
  }
  return <AddBlogPage post={post} />;
};

export default EditBlogPage;
