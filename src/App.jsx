import "./App.css";
import { Header, Footer } from "./components/index";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <div className="w-full h-screen bg-slate-600">
      <Header />
      <MainPage />
      <Footer />
    </div>
  );
}

export default App;
