import React, { useEffect, useState } from "react";
import './Coffee.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useUser } from '../components/user/UserContext';
import { useLogout } from '../components/Logout';
import Orders from '../components/order/Orders';


function Coffee() {
  const [token, setToken] = useState();
  const [coffeeList, setCoffeeList] = useState([]);
  const navigate = useNavigate();
  const { user, setUser } = useUser()
  const handleLogout = useLogout();

  useEffect(() => {
    if (!user) {
      navigate('/protected');
    }
  }, [user, navigate]);

  // console.log('user', user)

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setToken(token);
    } else {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const filteredCoffee = res.data.filter(coffee => coffee.p_type === "Coffee" && coffee.category_id === 1)
        setCoffeeList(filteredCoffee);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);


  return (
    <>
      <div className="flex-content">
        <Orders user={user} />

        <section className="menu">


          <div className="menu-drink">
            <h2 className="drink-type" style={{ backgroundColor: '#FFE8A3 ', border: 'solid #FFCD2B ' }}>
              Coffee
            </h2>
            <h2 className="drink-type">
              Tea
            </h2>
            <h2 className="drink-type">
              Choc
            </h2>
            <h2 className="drink-type">
              Anothor
            </h2>
          </div>


          <section className="flex-box">
            <div className="ice-hot">
              <h2 className="icehot-box" style={{ backgroundColor: '#BDE3FF', border: 'solid #0D99FF ' }}>ICE</h2>
              <h2 className="icehot-box" style={{ backgroundColor: '#FFC7C2', border: 'solid #FF8C82 ' }}>HOT</h2>
            </div>
          </section>


          <section className="product-section">
            {coffeeList &&
              coffeeList.map((coffee) => (
                <div className="product-flex" key={coffee.p_id}>
                  <ul className="product-box">
                    <li>{coffee.p_name}</li>
                  </ul>
                </div>
              ))}
          </section>


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
  )

}

export default Coffee;
