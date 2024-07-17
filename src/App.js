import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import PageAbout from "./components/PageAbout";
import Login from "./components/Login";
import Coffee from "./components/Coffee";
import Protected from "./components/api/Protected"
import Owner from "./components/Owner";
import InsertProduct from "./components/admin/products/Insert_products";
import EditProduct from "./components/admin/products/Edit_products";
import DeleteProducts from "./components/admin/products/Delete_products";
import { UserProvider } from "./components/user/UserContext"
import InsertOwner from './components/admin/owner/Inser_owner'

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/about" element={<PageAbout />} />
          <Route path="/coffee" element={<Coffee />} />
          <Route path="/protected" element={<Protected />} />
          <Route path="/owner" element={<Owner />} />
          <Route path='/insert_products' element={<InsertProduct />} />
          <Route path='/edit_products' element={<EditProduct />} />
          <Route path='/delete_products' element={<DeleteProducts />} />
          <Route path='/insert_owner' element={<InsertOwner />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}


export default App;
