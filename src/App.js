import React from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./components/user/UserContext";
import PageAbout from "./components/PageAbout";
import Login from "./components/Login";
import Coffee from "./components/Coffee";
import Protected from "./components/api/Protected";
import Owner from "./components/admin/owner/Owner";
import InsertOwner from './components/admin/owner/Inser_owner';
import EditOwner from './components/admin/owner/Edit_owner';
import DeleteOwner from './components/admin/owner/Delete_owner';
import Product from './components/admin/products/Product';
import InsertProduct from "./components/admin/products/Insert_products";
import EditProduct from "./components/admin/products/Edit_products";
import DeleteProducts from "./components/admin/products/Delete_products";
import Sidebar from "./components/Sidebar";

// Layout ที่มี Sidebar
function LayoutWithSidebar() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '150px', width: '100%' }}>
        <Outlet />
      </div>
    </div>
  );
}

// Layout ที่ไม่มี Sidebar
function LayoutWithoutSidebar() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Layout ที่ไม่มี Sidebar */}
          <Route element={<LayoutWithoutSidebar />}>
            <Route path="/" element={<Login />} />
            <Route path="/about" element={<PageAbout />} />
            <Route path="/coffee" element={<Coffee />} />
            <Route path="/protected" element={<Protected />} />
          </Route>

          <Route element={<LayoutWithSidebar />}>

            {/* Owner */}
            <Route path="/owners" element={<Owner />} />
            <Route path="/insert_owner" element={<InsertOwner />} />
            <Route path="/edit_owner" element={<EditOwner />} />
            <Route path="/delete_owner" element={<DeleteOwner />} />

            {/*Products */}
            <Route path="/products" element={<Product />} />
            <Route path="/insert_products" element={<InsertProduct />} />
            <Route path="/edit_products" element={<EditProduct />} />
            <Route path="/delete_products" element={<DeleteProducts />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
