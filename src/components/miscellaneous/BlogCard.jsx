const BlogCard = () => {
  return (
    <div className="w-[280px] h-[320px] bg-stone-600 rounded-3xl">
      <div className=" w-[full] h-[full] p-3 flex flex-col ">
        <div className="h-[150px] w-[full] bg-red-300">Image</div>
        <div className="h-[170px] w-[full]">Title</div>
      </div>
    </div>
  );
};

export default BlogCard;
