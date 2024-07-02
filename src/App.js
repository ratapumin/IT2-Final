import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import PageHome from "./components/PageHome";
import PageAbout from "./components/PageAbout";
import Login from "./components/Login";
import Coffee from "./components/Coffee";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageHome />} />
        <Route path="/about" element={<PageAbout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/coffee" element={<Coffee />} />
      </Routes>
    </Router>
  );
}


export default App;
