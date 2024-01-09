import PropTypes from "prop-types";
import parse from "html-react-parser";

const BlogCard = (props) => {
  return (
    <div className="w-[300px] h-[350px] bg-stone-600 rounded-3xl flex justify-center items-center">
      <div className=" w-[full] h-[full] p-5 pt-20 flex flex-col justify-center items-center">
        <div className="h-[150px] w-[full">
          <img src={props.image} className="w-full h-full rounded-2xl" />
        </div>
        <div className="w-[full] text-2xl mt-4 ">{props.title}</div>
        <div className="h-[170px] w-[full] mt-4 overflow-hidden">
          {parse(props.content)}
        </div>
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
};

export default BlogCard;
