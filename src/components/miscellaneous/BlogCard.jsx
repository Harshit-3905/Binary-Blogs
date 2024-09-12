import PropTypes from "prop-types";
import parse from "html-react-parser";
import LikeContainer from "../miscellaneous/Like.jsx";
import { EyeIcon } from "@primer/octicons-react";

const BlogCard = (props) => {
  return (
    <div className="w-[300px] h-[390px] bg-[#00B4D8] rounded-3xl flex justify-center items-center text-center">
      <div className=" w-[full] h-[full] p-5 flex flex-col">
        <img
          src={props.image}
          className="h-[150px] w-full rounded-2xl"
          loading="lazy"
        />
        <h1 className="w-full text-2xl mt-3 font-medium overflow-hidden">
          {props.title}
        </h1>
        <div className="w-full h-[100px] mt-3 overflow-hidden">
          {parse(props.content)}
        </div>
        <div className="flex justify-center items-center gap-2 text-lg">
          {props.liked && <LikeContainer liked={props.liked} />}{" "}
          {props.likes_count}
          {props.view_count && <EyeIcon size={24} />} {props.view_count}
        </div>
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
  likes_count: PropTypes.number,
  liked: PropTypes.bool,
  view_count: PropTypes.number,
};

export default BlogCard;
