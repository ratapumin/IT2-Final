import React, { useEffect, useState } from "react";
import './OrderProducts.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../user/UserContext';
import { useLogout } from '../Logout';
import Orders from './Orders';
import DrinkType from "./DrinkType";
import IceHot from "./IceHot";
import ProductList from './ProductList';

function OrderProducts() {
  const [token, setToken] = useState();
  const [selectedCategory, setSelectedCategory] = useState('ICE');
  const [selectedType, setSelectedType] = useState('Coffee');
  const navigate = useNavigate();
  const { user } = useUser();
  const handleLogout = useLogout();
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    if (!user || user.role === 'O') {
      navigate('/protected');
    }
  }, [user, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setToken(token);
    } else {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    console.log("Updated carts:", carts); // ตรวจสอบค่า carts หลังจากการเปลี่ยนแปลง
  }, [carts]);

  const handleProductSelect = (product) => {
    const currentProduct = product;
    console.log('current', currentProduct)
    const inCart = carts.find(cart => cart.p_id === product.p_id);

    if (inCart) {
      console.log('incart', inCart)
      // อัปเดตจำนวนสินค้าในรถเข็น
      setCarts(
        prevState => prevState.map(cart =>
          cart.p_id === product.p_id
            ? {
              ...cart,
              quantity: cart.quantity + 1
            }
            : cart
        )
      );
    } else {
      // เพิ่มสินค้าลงในรถเข็น
      setCarts(prevState => {
        const updatedCarts = [
          ...prevState,
          {
            p_id: currentProduct.p_id, // ใช้ p_id สำหรับการเปรียบเทียบ
            p_name: currentProduct.p_name,
            p_price: currentProduct.p_price,
            p_type: currentProduct.p_type,
            category: currentProduct.category,
            quantity: 1
          }
        ];
        console.log("Updated carts in callback:", updatedCarts); // แสดงผลค่าใหม่
        return updatedCarts;
      });
    }
  }

  return (
    <>
      <div className="flex-content">
        <Orders
          user={user}
          products={carts}
        />

        <section className="menu">
          <DrinkType
            selectedType={selectedType}
            onTypeClick={setSelectedType}
          />
          <section className="flex-box">
            <IceHot
              selectedCategory={selectedCategory}
              onCategoryClick={setSelectedCategory}
            />
          </section>

          <ProductList
            selectedCategory={selectedCategory}
            selectedType={selectedType}
            onProductSelect={handleProductSelect}
          />

          <section className="exit-box">
            <h1 onClick={handleLogout} style={{ cursor: "pointer" }}>
              EXIT
            </h1>
          </section>

          <section className="closeSales-box">
            <h3>
              Close daily Sales
            </h3>
          </section>

        </section>
      </div>
    </>
  );
}

export default OrderProducts;
