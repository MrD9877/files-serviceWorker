import "./App.css";
import { Routes, Route, Link } from "react-router";
import Home from "./routes/Home";
import Files from "./routes/Files";
import Worker from "./routes/Worker";
import Caches from "./routes/Caches";
function App() {
  return (
    <>
      <div className="flex flex-col absolute top-0 items-center justify-center ">
        <Link to={"/"}>Home</Link>
        <Link to={"/files"}>Files</Link>
        <Link to={"/worker"}>WebWorker</Link>
        <Link to={"/caches"}>Caches</Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/files" element={<Files />} />
        <Route path="/caches" element={<Caches />} />
        <Route path="/worker" element={<Worker />} />
      </Routes>
    </>
  );
}

export default App;
