const BlogCategories = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center underline underline-offset-4">
        Our Blog Categories
      </h2>
      <div className="grid md:grid-cols-3 gap-8 py-10 lg:px-20">
        {[
          {
            title: "Interview Preparation",
            description: "Tips and tricks for interview rounds.",
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
          },
          {
            title: "Coding",
            description:
              "Programming languages, algorithms, data structures, and more.",
            icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
          },
          {
            title: "Technology",
            description: "The latest trends in tech, industry news, and more.",
            icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
          },
        ].map((category, index) => (
          <div
            key={index}
            className="rounded-lg shadow-md p-6 flex flex-col items-center text-center bg-[#48CAE4]"
          >
            <svg
              className="w-12 h-12 text-cyan-500 mb-4"
              fill="none"
              stroke="black"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={category.icon}
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
            <p className="text-black">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogCategories;
