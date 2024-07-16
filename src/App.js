import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import PageAbout from "./components/PageAbout";
import Login from "./components/Login";
import Coffee from "./components/Coffee";
import Protected from "./components/Protected"
import Owner from "./components/Owner";
import InsertProduct from "./components/products/Insert_products";
import Update_products from "./components/products/Update_products";
import Delete_products from "./components/products/Delete_products";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/about" element={<PageAbout />} />
        <Route path="/coffee" element={<Coffee />} />
        <Route path="/protected" element={<Protected />} />
        <Route path="/owner" element={<Owner />} />
        <Route path='/insert_products' element={<InsertProduct />} />
        <Route path='/update_products' element={<Update_products />} />
        <Route path='/delete_products' element={<Delete_products />} />
      </Routes>
    </Router>
  );
}


export default App;
