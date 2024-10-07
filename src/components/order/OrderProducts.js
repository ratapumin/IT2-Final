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
import CloseDaily from "./cash/CloseDaily";
import axios from "axios";
import moment from "moment";



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
  const [getPoints, setGetPoints] = useState('');
  const [redeemPoints, setRedeemPoints] = useState('')
  const [minusCash, setMinusCash] = useState('')
  const [isModalCloseDaily, setIsModalCloseDaily] = useState(false)
  const [showorderId, setShowOrderId] = useState()






  useEffect(() => {
    if (!user || user.role === 'a' && user.role === 'o') {
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
    console.log(showorderId)
  }, [showorderId, carts])

  // useEffect(() => {
  //   console.log(member)
  //   console.log(sumCash)
  //   console.log(currentPoints)
  //   console.log(collectPoints)
  //   // console.log(sumCash / 25)

  // })

  const handleOrderId = (value) => {
    setShowOrderId(value)
  }


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
    setMember('')
    setGetPoints('')
    setRedeemPoints('')
    setSelectedType('Coffee');
    setSelectedCategory('ICE')
    setMinusCash('')
    setShowOrderId()
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

  useEffect(() => {
    if (selectedType === 'CloseDaily') {
      handleCloseDaily(true)
    }

  }, [selectedType]);



  const handleCashAmount = (cash) => {
    setCashAmount(cash)
    console.log(cashAmount)
  }

  const handleSetSum = (sum) => {
    setSumCash(sum);
    // handleGetPoints();
    // handleRedeemPoints();
  };

  const handleChange = (change) => {
    setChange(change)
  }

  const handleSetMember = (member) => {
    setMember(member)
  }

  const handleGetPoints = (member) => {
    console.log('handleGetPoints called');
    console.log('Current member:', member);
    if (member) {
      const dividePoints = Math.floor(sumCash / 25);
      setGetPoints(dividePoints);
      console.log('getPoints', dividePoints);
    } else {
      console.log('No member found');
    }
  };

  const handleRedeemPoints = (member) => {
    console.log('handleRedeemPoints called');
    console.log('Current member:', member);
    if (member) {
      const currentPoints = member.c_points;
      const dividePoints = Math.floor(sumCash / 25);
      setGetPoints(dividePoints);
      if (currentPoints >= 10) {
        const minusPoints = 10;
        const minusMoney = sumCash - 5
        setRedeemPoints(minusPoints);
        setMinusCash(minusMoney)
        console.log('redeemPoints', minusPoints);
      }
    } else {
      console.log('No member found');
    }
  };

  const handleCloseDaily = (param) => {
    setIsModalCloseDaily(param)
    if (param === false) {
      setSelectedType('Coffee');
    }
  }

  useEffect(() => {
    if (carts.length > 0) {

        const fetchOrderId = async () => {
            try {
                // ดึงวันที่ปัจจุบันในรูปแบบ YYYYMMDD
                const currentDate = moment().format('YYYYMMDD');

                // ดึงข้อมูลออเดอร์จาก API
                const res = await axios.get("http://localhost:5000/api/readorder");
                const orders = res.data;

                // กรองข้อมูลเฉพาะ order_id ที่เป็นตัวเลข
                const filterOrderIds = orders
                    .map(order => order.order_id)
                    .filter(order_id => order_id.startsWith(currentDate))  // เลือกเฉพาะออเดอร์ที่มีวันที่ตรงกับวันปัจจุบัน
                    .map(order_id => parseInt(order_id.slice(8), 10));      // ดึงเฉพาะเลขลำดับ (เช่น 001, 002, ...)

                // ถ้าไม่มีออเดอร์ในวันนั้น ให้เริ่มที่ 001 ถ้ามีแล้วให้เพิ่มจากลำดับสูงสุด
                const nextOrderNumber = filterOrderIds.length === 0
                    ? '001'
                    : (Math.max(...filterOrderIds) + 1).toString().padStart(3, '0');

                // สร้าง order_id ในรูปแบบ YYYYMMDD + เลขลำดับ
                const newOrderId = `${currentDate}${nextOrderNumber}`;
                setShowOrderId(newOrderId); // Change here
                // Set ค่า order_id ใน state
                // setOrderId(newOrderId);
            } catch (error) {
                console.log("Cannot fetch order", error);
            }
        };
        fetchOrderId();
    }
}, [carts]);


  const warning = () => {
    Modal.confirm({
      title: "Logout",
      content: "Are you sure you want to logout?",
      centered: true,
      onOk: handleLogout,
      onCancel: () => setSelectedType('Coffee'),
    });
  };

  const handleResetMember = () => {
    setMember(null);
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
          getPoints={getPoints}
          redeemPoints={redeemPoints}
          minusCash={minusCash}
          showorderId={showorderId}
        />

        <section className="menu">
          <DrinkType
            selectedType={selectedType}
            onTypeClick={setSelectedType}
          />


          {
            selectedType !== 'Management' &&
            selectedType !== 'Cash' &&
            selectedType !== 'CloseDaily' &&
            selectedType !== 'Logout' &&
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

          {selectedType === 'Management' && (
            <Another
              selectedCategory={selectedCategory}
              selectedType={selectedType}
            />
          )}

          {/* {selectedType === 'CloseDaily' && (
            <>
              <CloseDaily
                CloseDaily={isModalCloseDaily}
                handleCloseDaily={handleCloseDaily}
              />
            </>
          )} */}

          {selectedType === 'Logout' && (
            <>


            </>
          )}

          {selectedType === 'Cash' && (
            <Payment
              onCashChange={handleCashAmount}
              products={carts}
              sumCash={sumCash}
              onChange={handleChange}
              onDeleteAll={handleDeletedAll}
              selectedType={(type) => setSelectedType(type)}
              OnsaveMember={handleSetMember}
              resetMember={handleResetMember}
              onGetPoints={handleGetPoints}
              onRedeemPoints={handleRedeemPoints}
              getPoints={getPoints}
              redeemPoints={redeemPoints}
              showorderId={handleOrderId}
            // currentPoints={currentPoints}
            />


          )}
        </section>
      </div>
    </>
  );
}

export default OrderProducts;
