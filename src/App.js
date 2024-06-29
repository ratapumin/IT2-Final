import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
// import logo from "./img/logo-kathong.png";
import PageHome from "./components/PageHome";
import PageAbout from "./components/PageAbout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageHome />} />
        <Route path="/about" element={<PageAbout />} />
      </Routes>
    </Router>
  );
}

export default App;
