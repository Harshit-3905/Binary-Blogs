import { useParams } from "react-router-dom";

const EditBlogPage = () => {
  const slug = useParams().slug;
  return <div>{slug}</div>;
};

export default EditBlogPage;
