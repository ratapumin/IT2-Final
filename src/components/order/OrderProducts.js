import React, { useEffect, useState } from "react";
import './OrderProducts.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../user/UserContext';
import { useLogout } from '../Logout';
import Orders from './Orders';
import DrinkType from "./DrinkType";
import IceHot from "./IceHot";
import ProductList from './ProductList';
import Another from "./Another";
import Payment from "./cash/Payment";



function OrderProducts() {
  const [token, setToken] = useState();
  const [selectedCategory, setSelectedCategory] = useState('ICE');
  const [selectedType, setSelectedType] = useState('Coffee');
  const [cash, setCash] = useState(false)
  const navigate = useNavigate();
  const { user } = useUser();
  const handleLogout = useLogout();
  const [carts, setCarts] = useState([]);
  const [cashAmount, setCashAmount] = useState('')
  const [sumCash, setSumCash] = useState('')
  const [change, setChange] = useState('')
  const [member, setMember] = useState('')

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
    console.log(carts)
  })

  useEffect(() => {
    console.log(member)
  })


  const handleProductSelect = (product) => {
    const currentProduct = product;
    const inCart = carts.find(cart => cart.p_id === product.p_id);

    if (inCart) {
      setCarts(prevState =>
        prevState.map(cart =>
          cart.p_id === product.p_id
            ? {
              ...cart,
              quantity: cart.quantity + 1
            }
            : cart
        )
      );
    } else {
      setCarts(prevState => [
        ...prevState,
        {
          p_id: currentProduct.p_id,
          p_name: currentProduct.p_name,
          p_price: currentProduct.p_price,
          p_type: currentProduct.p_type,
          category: currentProduct.category,
          quantity: 1
        }
      ]);
    }
  }



  const handleUpdateCart = (updatedCart) => {
    setCarts(updatedCart);
  }

  const handleDeletedAll = () => {
    setCarts([]);
    setCashAmount('');
    setSumCash('');
    setChange('');
  };



  const handleCash = () => {
    console.log(carts)
    if (carts.length > 0) {
      setCash(true)
      setSelectedType('Cash');
    } else {
      setCash(false)
      setSelectedType('Coffee');
    }

  }

  const handleCashAmount = (cash) => {
    setCashAmount(cash)
    console.log(cashAmount)
  }

  const handleSetSum = (sum) => {
    setSumCash(sum);
  }
  const handleChange = (change) => {
    setChange(change)
  }

  const handleSetMember = (member) => {
    setMember(member)
  }

  return (
    <>
      <div className="flex-content">
        <Orders
          user={user}
          products={carts}
          onUpdateCart={handleUpdateCart}
          onDeleteAll={handleDeletedAll}
          onCash={handleCash}
          cash={cashAmount}
          sumCash={handleSetSum}
          change={change}
          OnsaveMember={member}
        />

        <section className="menu">
          <DrinkType
            selectedType={selectedType}
            onTypeClick={setSelectedType}
          />


          {selectedType !== 'Member' && selectedType !== 'Cash' && (
            <>
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
            </>
          )}

          {selectedType === 'Member' && (
            <Another />
          )}

          {selectedType === 'Cash' && (
            <Payment
              onCashChange={handleCashAmount}
              products={carts}
              sumCash={sumCash}
              onChange={handleChange}
              onDeleteAll={handleDeletedAll}
              selectedType={(type) => setSelectedType(type)} // ส่งฟังก์ชันไป
              OnsaveMember={handleSetMember}
            />

          )}

          <section className="exit-box">
            <h1 onClick={handleLogout} style={{ cursor: "pointer" }}>
              EXIT
            </h1>
          </section>
          {/* 
          <section className="closeSales-box">
            <h3>Close daily Sales</h3>
          </section> */}
        </section>
      </div>
    </>
  );
}

export default OrderProducts;
