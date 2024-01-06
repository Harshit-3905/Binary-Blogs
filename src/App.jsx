import "./App.css";
import { Header, Footer } from "./components/index";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="w-full min-h-[80vh] bg-slate-600">
      <Header />
      <div className="w-full min-h-[80vh] bg-green-600 flex flex-col items-center justify-center">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
