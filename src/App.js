import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import PageAbout from "./components/PageAbout";
import Login from "./components/Login";
import Coffee from "./components/Coffee";
import Protected from "./components/Protected"
import Owner from "./components/Owner";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/about" element={<PageAbout />} />
        <Route path="/coffee" element={<Coffee />} />
        <Route path="/protected" element={<Protected />} />
        <Route path="/owner" element={<Owner />} />
      </Routes>
    </Router>
  );
}


export default App;
