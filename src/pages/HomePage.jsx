import HeroSection from "../components/miscellaneous/HeroSection";
import BlogCategories from "../components/miscellaneous/BlogCategories";
import TrendingBlogs from "../components/miscellaneous/TrendingBlogs";

const HomePage = () => {
  return (
    <div className="w-full ">
      <HeroSection />
      <TrendingBlogs />
      <BlogCategories />
    </div>
  );
};

export default HomePage;
