import "./App.css";
import { Header, Footer, MainPage } from "./components/index";

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
