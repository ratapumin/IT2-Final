import React, { useEffect, useState } from "react";
import './Coffee.css';
import { useNavigate } from 'react-router-dom';
import User from "./User";
import axios from "axios";

// import Owner from "./Owner";

function Coffee() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(null)
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');

    navigate("/");
  }
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));

    console.log('userdata', userData.user_fname)
    if (userData) {
      const userdata = new User(userData.user_fname, userData.user_lname, userData.user_tel)
      setUser(userdata);
    } else {
      navigate("/");
    }
  }, [navigate]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3333/api/products')
        setProducts(res.data)
      } catch (error) {
        console.log(error)

      }
     
    }
    fetchProducts()
  },[])

  console.log(products)
  return (
    <>
      {/* <p>{products}</p> */}

    </>
  )
  //  <>
  //   <div className="container">
  //     <div className="grid">
  //       <div className="content-order  ">
  //         <p>New Order</p>
  //         <p>page {user && user.get_fname()}</p>
  //       </div>

  //       <div className="type-menu ">
  //         <div className="content-box">
  //           <p>COF</p>
  //           <p>TEA</p>
  //           <p>CHOC</p>
  //           <p>SODA</p>
  //           <p>ANOTHER</p>
  //         </div>

  //         <div className="ice-hot  ">
  //           <div className="content-box">
  //             <p> ICE</p>
  //             <p> HOT</p>
  //           </div>
  //         </div>

  //         <div className="main-content ">
  //           <p className="item">Americano</p>
  //           <p className="item">Americano Honey</p>
  //           <p className="item">Americano Honey Lemon</p>
  //           <p className="item">Espesso</p>
  //           <p className="item">Americano</p>
  //           <p className="item">Americano Honey</p>
  //           <p className="item">Americano Honey Lemon</p>
  //           <p className="item">Espesso</p>
  //           <p className="item">Americano</p>
  //           <p className="item">Americano Honey</p>
  //           <p className="item">Americano Honey Lemon</p>
  //           <p className="item">Espesso</p>
  //           <p className="item">Americano</p>
  //           <p className="item">Americano Honey</p>
  //           <p className="item">Americano Honey Lemon</p>
  //           <p className="item">Espesso</p>
  //           <p className="item">Americano</p>
  //           <p className="item">Americano Honey</p>
  //           <p className="item">Americano Honey Lemon</p>
  //           <p className="item">Espesso</p>
  //         </div>


  //         <div className="button-close-daily">
  //           <p>Close Daily</p>
  //         </div>

  //         <div className="button-exit">
  //           <button onClick={handleLogout}>Exit</button>
  //         </div>

  //       </div>
  //     </div>
  //   </div>
  // </>;
}

export default Coffee;