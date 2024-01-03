// import BlogPage from "./BlogPage";
// import HomePage from "./HomePage";
import LoginPage from "./LoginPage";

const MainPage = () => {
  return (
    <div className="w-full min-h-[80vh] bg-green-600 flex flex-col items-center justify-center">
      <LoginPage />
      {/* <BlogPage /> */}
      {/* <HomePage /> */}
    </div>
  );
};

export default MainPage;
