import "./App.css";
import { Header, Footer } from "./components/index";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="w-screen h-screen">
      <Header />
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-[#ADE8F4]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
