import React, { useEffect, useState } from "react";
import './Coffee.css';
import { useNavigate } from 'react-router-dom';
import User from "./User";
import axios from "axios";

function Coffee() {
  const [token, setToken] = useState();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate("/");
  }

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setToken(token);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const handleItem = (id) => {
    const selected = products.find(product => product.p_id === id);
    const existingIndex = selectedProducts.findIndex(product => product.id === id);

    if (existingIndex !== -1) {
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingIndex] = {
        ...updatedProducts[existingIndex],
        quantity: updatedProducts[existingIndex].quantity + 1
      };
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts(prevState => [
        ...prevState,
        { id: selected.p_id, name: selected.p_name, price: selected.p_price, quantity: 1 }
      ]);
    }
  };

  const productslist = products.map(item => (
    <button className="item" key={item.p_id} onClick={() => handleItem(item.p_id)}>
      {item.p_name}
    </button>
  ));

  return (
    <>
      <div className="container">
        <div className="grid">
          <div className="content-order">
            <p>New Order</p>
            {/* <p>page {user && user.get_fname()}</p> */}
            {selectedProducts.length > 0 && selectedProducts.map(product => (
              <div key={product.id}>
                <p>Product: {product.name}</p>
                <p>Price: {product.price}</p>
                <p>Quantity: {product.quantity}</p>
              </div>
            ))}
          </div>

          <div className="type-menu">
            <div className="content-box">
              <p>COF</p>
              <p>TEA</p>
              <p>CHOC</p>
              <p>SODA</p>
              <p>ANOTHER</p>
            </div>

            <div className="ice-hot">
              <div className="content-box">
                <p> ICE</p>
                <p> HOT</p>
              </div>
            </div>

            <div className="main-content">
              {productslist}
            </div>

            <div className="button-close-daily">
              <p>Close Daily</p>
            </div>

            <div className="button-exit">
              <button className="item" onClick={handleLogout}>Exit</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Coffee;
