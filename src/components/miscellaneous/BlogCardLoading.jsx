import defaultImage from "../../assets/defaultImage.png";

const BlogCard = () => {
  return (
    <div className="w-[300px] h-[380px] bg-[#00B4D8] rounded-3xl flex justify-center items-center text-center">
      <div className=" w-[full] h-[full] flex flex-col">
        <div className="h-[150px] w-full">
          <img src={defaultImage} className="w-full h-full rounded-2xl" />
        </div>
        <div className="w-full h-[2rem] mt-3 font-medium bg-slate-400 rounded-2xl"></div>
        <div className="w-full h-[100px] mt-3 overflow-hidden bg-slate-400 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default BlogCard;
