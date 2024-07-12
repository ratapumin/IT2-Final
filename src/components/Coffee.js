import React, { useEffect, useState } from "react";
import './Coffee.css';
import { useNavigate } from 'react-router-dom';
import User from "./User";
import axios from "axios";

function Coffee() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    navigate("/");
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      const userdata = new User(userData.user_fname, userData.user_lname, userData.user_tel);
      setUser(userdata);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3333/api/products');
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const handleItem = (id) => {
    const selected = products.find(product => product.p_id === id);
    const existingProduct = selectedProducts.find(product => product.id === id);

    if (existingProduct) {
      setSelectedProducts(prevState => prevState.map(product =>
        product.id === id ? { ...product, quantity: product.quantity + 1 } : product
      ));
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
            <p>page {user && user.get_fname()}</p>
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
