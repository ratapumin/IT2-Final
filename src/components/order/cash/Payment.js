import { useEffect, useState } from 'react';
import Cashmoney from './Cashmoney';
import { Modal, Form, Input, Button, notification } from 'antd';
import './Payment.css';
import axios from 'axios';
// import Promtpay from './Promtpay';
import { createOrder } from './Cashmoney';
import { useUser } from '../../user/UserContext';
import moment from 'moment';
import PrintReceipt from './PrintReceipt';
import SetMoney from './SetMoney';

function Payment({
    onCashChange, products, sumCash, onChange, onDeleteAll, selectedType,
    OnsaveMember, resetMember, onGetPoints, redeemPoints, getPoints, onRedeemPoints, showorderId

}) {
    const [points, setPoints] = useState(false);
    const [collect, setCollect] = useState(false);
    const [redeem, setRedeem,] = useState(false);
    const [tel, setTel] = useState('');
    const [contactName, setContactName] = useState('');
    const [members, setMembers] = useState([])
    const [currentMember, setCurrentMember] = useState()
    const [paymentType, setPaymentType] = useState('cash')
    const [isModalPromtpay, setIsModalPromtpay] = useState(false)
    const [showCreateOrder, setShowCreateOrder] = useState(false); // State for triggering order creation
    const [orderId, setOrderId] = useState('');
    const [orderNo, setOrderNo] = useState('');
    const [money, setMoney] = useState()
    const { user } = useUser();
    const [orderInfo, setOrderInfo] = useState();
    const fetchMembers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/members')
            console.log(res.data)
            setMembers(res.data)
        } catch (error) {
            console.log("Cannot fetch Members", error);
        }
    }


    useEffect(() => {
        fetchMembers()
    }, [])

    const handleTelChange = (e) => {
        setTel(e.target.value);
    };

    const handleSearch = () => {
        const member = members.find(member => member.c_tel === tel);
        if (member) {
            setCurrentMember(member);
            setContactName(`${member.c_fname} ${member.c_lname} Points: ${member.c_points}`);
        } else {
            setCurrentMember(null);
            setContactName('ไม่พบข้อมูล');
        }
        // console.log('findmember', member);
    };

    const handleSelectMemberCollect = () => {
        const member = members.find(member => member.c_tel === tel);
        if (member) {
            setCurrentMember(member);
            OnsaveMember(member);
            onGetPoints(member);
        } else {
            setCurrentMember(null);
        }
        setCollect(false);
    };
    
    const handleSelectMemberRedeem = () => {
        const member = members.find(member => member.c_tel === tel);
        if (member) {
            setCurrentMember(member);
            OnsaveMember(member);
            onRedeemPoints(member);
        } else {
            setCurrentMember(null);
        }
        setRedeem(false);
    };
    


    const handleCollect = () => {
        setCollect(false);
        setTel('');
        setContactName('');
    };

    const handleRedeem = () => {
        setRedeem(false);
        setTel('');
        setContactName('');
    };


    useEffect(() => {
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
                    .map(order_id => parseInt(order_id.slice(8), 10)); // ดึงเฉพาะเลขลำดับ (เช่น 001, 002, ...)

                // ถ้าไม่มีออเดอร์ในวันนั้น ให้เริ่มที่ 001 ถ้ามีแล้วให้เพิ่มจากลำดับสูงสุด
                const nextOrderNumber = filterOrderIds.length === 0
                    ? '001'
                    : (Math.max(...filterOrderIds) + 1).toString().padStart(3, '0');

                // สร้าง order_id ในรูปแบบ YYYYMMDD + เลขลำดับ
                const newOrderId = `${currentDate}${nextOrderNumber}`;

                // Set ค่า order_id และ order_no ใน state
                setOrderId(newOrderId);
                setOrderNo(nextOrderNumber); // เพิ่มการตั้งค่า order_no ที่นี่

            } catch (error) {
                console.log("Cannot fetch order", error);
            }
        };

        fetchOrderId();
    }, []);

    console.log(orderId)
    const utcDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const setOrderData = () => {
        let c_id = currentMember ? `${currentMember.c_id}` : null;
        let newPoints = currentMember ? getPoints || 0 : 0;
        let minusPoints = currentMember ? redeemPoints || 0 : 0;
        

        const historyEntries = [];

        // Add earn entry if newPoints exists
        if (newPoints > 0) {
            historyEntries.push({
                c_id: c_id,
                points: newPoints,
                type: 'earn',
                transaction_data: utcDate
            });
        }

        // Add redeem entry if minusPoints exists
        if (minusPoints > 0) {
            historyEntries.push({
                c_id: c_id,
                points: -minusPoints,
                type: 'redeem',
                transaction_data: utcDate
            });
        }

        return {
            order_id: orderId,
            order_no: orderNo,
            order_date_time: utcDate,
            payment_type: paymentType,
            user_id: user.user_id,
            c_id: c_id,
            products: products.map(product => ({
                p_id: product.p_id,
                p_price: product.p_price,
                p_type: product.category,
                quantity: product.quantity
            })),
            history: historyEntries, // Store an array of history entries
            customer: {
                c_id: c_id,
                c_points: newPoints - minusPoints // Adjust points balance
            }
        };
    };

    // const orderData = setOrderData();
    // console.log(orderData)

    const handleCallPageCreateOrder = () => {
        setShowCreateOrder(false);
        const createOrderData = setOrderData()
        setOrderInfo(createOrderData)
        // console.log('Order Data:', orderInfo);
        // console.log('eie prommp')
        onDeleteAll();
        resetMember();
        selectedType('Coffee');

    }

    useEffect(() => {
        if (paymentType === 'promtpay') {
            setIsModalPromtpay(true);
            setOrderInfo(setOrderData());
        }
    }, [paymentType]);
    const handleClosePromtpay = () => {
        setIsModalPromtpay(false)
        setPaymentType('cash')
    }
    const showSuccessNotification = () => {
        notification.success({
            message: 'Payment Successful',
            description: 'Your payment via Promtpay was successful!',
            duration: 3, // ระยะเวลาในการแสดง (3 วินาที)
        });
    };

    const handlesetMoney = (value) => {
        setMoney(value)
        // console.log(money)
    }
    const handleDeleteConfigMoney = () => {
        setMoney()
    }
    // useEffect(() => {
    //     console.log(money)
    // }, [money]);
    return (
        <div className="flexCash">
            <Cashmoney
                onCashChange={onCashChange}
                products={products}
                sumCash={sumCash}
                onChange={onChange}
                onDeleteAll={onDeleteAll}
                selectedType={selectedType}
                sentMember={currentMember}
                resetMember={resetMember}
                getPoints={getPoints}
                redeemPoints={redeemPoints}
                paymentType={paymentType}
                configMoney={money}
                deleteconfigMoney={handleDeleteConfigMoney}
            />

            <button
                className={`btnClick ${paymentType === 'points' ? 'active' : ''}`}
                onClick={() => {
                    setPaymentType('points')
                    setPoints(true);

                }
                }
            >POINTS</button>

            <button
                className={`btnClick ${paymentType === 'cash' ? 'active' : ''}`}
                onClick={() => {
                    setPaymentType('cash')
                }}
            >
                CASH
            </button>


            <button
                className={`btnClick ${paymentType === 'promtpay' ? 'active' : ''}`}
                onClick={() => {
                    setPaymentType('promtpay')
                    // setIsModalPromtpay(true)
                    // setOrderInfo(setOrderData())
                }}

            >
                PROMPTPAY
            </button>


            {paymentType === 'promtpay' && orderInfo && (
                <>
                    <Modal
                        title="QR Code สำหรับชำระเงิน"
                        centered
                        open={isModalPromtpay}
                        onOk={() => {
                            setPaymentType('promtpay');
                            setIsModalPromtpay(false);
                            createOrder(setOrderData, handleCallPageCreateOrder);
                            showSuccessNotification();
                        }}
                        onCancel={() =>
                            handleClosePromtpay()
                        }
                        closable={false}
                        style={{ textAlign: "center" }}
                        width={500}
                    >
                        {/* <Promtpay sumCash={sumCash} /> */}
                        <b>
                            "Press 'OK' after the transfer is successful."
                        </b>
                        {orderInfo
                            ?
                            <PrintReceipt orderData={orderInfo} />
                            : console.log('nodata promtpay')
                        }
                    </Modal>
                </>
            )
            }

            <SetMoney
                configMoney={handlesetMoney}
            />



            <Modal
                title="Points"
                style={{ textAlign: "center" }}
                centered
                open={points}
                onOk={() => {
                    setPoints(false)
                    setPaymentType('cash')
                }
                }
                cancelButtonProps={{ style: { display: 'none' } }}
                closable={false}
            >
                <button
                    className='btnCollect'
                    onClick={() => setCollect(true)}
                >
                    Collect
                </button>
                <button
                    className='btnRedeem'
                    onClick={() => {

                        setRedeem(true)

                    }

                    }
                >
                    Redeem
                </button>
            </Modal>

            <Modal
                title="Collect Points"
                style={{ textAlign: "center" }}
                centered
                open={collect}
                onOk={handleSearch}
                footer={[
                    <Button key="search" onClick={handleSearch}>
                        Search
                    </Button>,
                    <Button key="select" type="primary" onClick={handleSelectMemberCollect}>
                        Submit
                    </Button>
                ]}
                onCancel={() => handleCollect()}
                cancelButtonProps={{ style: { display: 'none' } }}
            // closable={false}
            >
                <Form>
                    <Form.Item>
                        <Input
                            placeholder='Tel.'
                            type='text'
                            name='tel'
                            value={tel}
                            onChange={handleTelChange}
                        />
                    </Form.Item>
                    {contactName && <p>Name: {contactName}</p>}
                </Form>
            </Modal>


            <Modal
                title="Redeem Points"
                style={{ textAlign: "center" }}
                centered
                open={redeem}
                onOk={handleSearch}
                footer={[
                    <Button key="search" onClick={handleSearch}>
                        Search
                    </Button>,
                    <Button key="select" type="primary" onClick={handleSelectMemberRedeem}>
                        Submit
                    </Button>
                ]}
                onCancel={() => handleRedeem()}
                cancelButtonProps={{ style: { display: 'none' } }}
            // closable={false}
            >
                <Form>
                    <Form.Item>
                        <Input
                            placeholder='Tel.'
                            type='text'
                            name='tel'
                            value={tel}
                            onChange={handleTelChange}
                        />
                    </Form.Item>
                    {contactName && <p>Name: {contactName}</p>}
                </Form>
            </Modal>




        </div >
    );
}

export default Payment;
