import PropTypes from "prop-types";
import parse from "html-react-parser";

const BlogCard = (props) => {
  return (
    <div className="w-[300px] h-[380px] bg-[#00B4D8] rounded-3xl flex justify-center items-center text-center">
      <div className=" w-[full] h-[full] p-5 flex flex-col">
        <img src={props.image} className="h-[150px] w-full rounded-2xl" />
        <h1 className="w-full text-2xl mt-3 font-medium">{props.title}</h1>
        <div className="w-full h-[100px] mt-3 overflow-hidden">
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
