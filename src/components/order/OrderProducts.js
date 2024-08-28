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
import { Button, Modal } from 'antd';


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
  const [modalLogout, setModalLogout] = useState(false);




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

  useEffect(() => {
    if (selectedType === 'Logout') {
      warning()
      setModalLogout(true);
    }

  }, [selectedType]);



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




  const warning = () => {
    Modal.confirm({
      title: "Logout",
      content: "Are you sure you want to logout?",
      centered: true,
      onOk: handleLogout,
      onCancel: () => setSelectedType('Coffee'), // ปิดวงเล็บที่ถูกต้อง
    });
  };

  const handleResetMember = () => {
    setMember(null); // รีเซ็ตข้อมูลสมาชิก
  };


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


          {
            selectedType !== 'Member' &&
            selectedType !== 'Cash' &&
            selectedType !== 'CloseDaily' &&
            (
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

          {selectedType === 'CloseDaily' && (
            <p>
              CloseDaily
            </p>
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
              resetMember={handleResetMember}
            />

          )}
        </section>
      </div>
    </>
  );
}

export default OrderProducts;
