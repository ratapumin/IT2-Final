import { useEffect, useState } from 'react';
import Cashmoney from './Cashmoney';
import { Modal, Form, Input, Button, notification } from 'antd';
import './Payment.css';
import axios from 'axios';
import Promtpay from './Promtpay';
import { createOrder } from './Cashmoney';
import { useUser } from '../../user/UserContext';
import moment from 'moment';
import PrintReceipt from './PrintReceipt';

function Payment({
    onCashChange, products, sumCash, onChange, onDeleteAll, selectedType,
    OnsaveMember, resetMember, onGetPoints, redeemPoints, getPoints, onRedeemPoints

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
        setCurrentMember(member)
        setContactName(member ? `${member.c_fname}  ${member.c_lname} Points: ${member.c_points}` : 'ไม่พบข้อมูล');
        console.log('findmember', member)
    };

    const handleSelectMemberCollect = () => {
        const member = members.find(member => member.c_tel === tel);
        setCurrentMember(member)
        console.log('findmember', member)
        OnsaveMember(member)
        if (member) {
            onGetPoints(member)
        }
        setCollect(false)
    };


    const handleSelectMemberRedeem = () => {
        const member = members.find(member => member.c_tel === tel);
        setCurrentMember(member)
        console.log('findmember', member)
        OnsaveMember(member)
        if (member) {
            onRedeemPoints(member)
        }
        setRedeem(false)
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
                const res = await axios.get("http://localhost:5000/api/readorder");
                const filterOrderId = res.data.map(order => parseInt(order.order_id, 10)).filter(id => !isNaN(id));
                const filterOrderNo = res.data.map(order => parseInt(order.order_no, 10)).filter(no => !isNaN(no));

                setOrderId(filterOrderId.length === 0 ? '1' : (Math.max(...filterOrderId) + 1).toString().padStart(4, '0'));
                setOrderNo(filterOrderNo.length === 0 ? '1' : (Math.max(...filterOrderNo) + 1).toString().padStart(3, '0'));
            } catch (error) {
                console.log("Cannot fetch order", error);
            }
        };

        fetchOrderId();
    }, []);

    const utcDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const setOrderData = () => {
        let c_id = currentMember ? `${currentMember.c_id}` : null;
        let newPoints = getPoints || 0;
        let minusPoints = redeemPoints || 0;

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
        console.log('Order Data:', orderInfo);
        console.log('eie prommp')
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
