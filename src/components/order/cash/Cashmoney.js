import { useEffect, useState } from 'react';
import './Cashmoney.css';
import axios from 'axios';
import { useUser } from '../../user/UserContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Modal, notification } from 'antd'; // เพิ่ม notification
import PrintReceipt from './PrintReceipt';

const createOrder = async (setOrderData, onDeleteAll) => {
    try {
        const orderData = setOrderData(); 
                console.log("Order Data before sending:", orderData); 
        await axios.post('http://localhost:5000/api/createOrder', orderData);
        console.log('Order created successfully');
        console.log('Order Data:', orderData);
        onDeleteAll();
    } catch (error) {
        console.error('Error creating order:', error);
    }
};

function Cashmoney({ onCashChange, products, sumCash, onChange, onDeleteAll,
    selectedType, sentMember, resetMember, getPoints, redeemPoints, paymentType, configMoney, deleteconfigMoney
}) {
    const [orderId, setOrderId] = useState('');
    const [orderNo, setOrderNo] = useState('');
    const navigate = useNavigate();
    const { user } = useUser();
    const [cash, setCash] = useState('');
    const [change, setChange] = useState('');
    const [modal2Open, setModal2Open] = useState(false);
    const [orderInfo, setOrderInfo] = useState();

    useEffect(() => {
        if (!user || user.role === 'O') {
            navigate('/protected');
        }
    }, [user, navigate]);

    const countNum = () => {
        const number = [];
        for (let i = 1; i <= 9; i++) {
            number.push(i);
        }
        return number;

    };

    useEffect(() => {
        if (configMoney) {
            setCash(configMoney.toString());
            onCashChange(configMoney);
            // console.log('cash', cash)
        }
    }, [configMoney, onCashChange]);

    // useEffect(() => {
    //     console.log('getPoints', getPoints);
    //     console.log('redeemPoints', redeemPoints);
    //     console.log(configMoney)
    // }, [configMoney, getPoints, redeemPoints]);


    const calNum = (num) => {
        const newCash = cash + num.toString();
        setCash(newCash);
        onCashChange(newCash);
        // console.log("Updated Cash in calNum:", newCash);
    };



    // คิดเงิน
    useEffect(() => {
        if (cash && sumCash) {
            let totalAmount = Number(sumCash);
            if (redeemPoints) {
                totalAmount -= 5;
                console.log(totalAmount)
            }
            console.log('cash', cash)
            const changeAmount = Number(cash) - Number(totalAmount);
            setChange(changeAmount > 0 ? changeAmount : 0);
            onChange(changeAmount > 0 ? changeAmount : 0);
            // console.log("Calculated Change:", changeAmount);
            // console.log("Calculated sumCash:", sumCash);
            // console.log("Calculated onChange:", onChange);
        }
    }, [cash, sumCash, onChange]);
    // console.log(cash)


    const handleDelete = () => {
        // console.log(typeof cash);
        const newCash = cash.slice(0, -1);
        setCash(newCash);
        onCashChange(newCash);
        // console.log("New Cash after delete:", newCash);
        if (configMoney > 0) {
            deleteconfigMoney()
        }


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

    const utcDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const setOrderData = () => {
        let c_id = sentMember ? `${sentMember.c_id}` : null;
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

    const clearDataAll = () => {
        setCash('');
        setChange('');
        onDeleteAll();
        resetMember();
        selectedType('Coffee');
    };
    const handleEnterClick = () => {
        // กำหนดยอดรวมที่ต้องจ่าย
        let totalAmount = Number(sumCash);

        // หากมีการใช้แต้ม ให้หัก 5 บาท
        if (redeemPoints) {
            totalAmount -= 5;
        }

        // ตรวจสอบว่าเงินสดที่กรอกเข้ามามีมากพอหรือไม่
        if (Number(cash) < totalAmount) {
            Modal.error({
                title: 'Insufficient Cash',
                content: 'Please enter enough cash to complete the transaction.',
                centered: true,
            });
            return;
        }

        // สร้าง orderInfoData เป็น object
        const orderInfoData = {
            ...setOrderData(), // get the order data from setOrderData
            cash: cash,       // เพิ่ม cash
            change: change    // เพิ่ม change
        };

        console.log(orderInfoData); // Log to ensure order info is correct
        setOrderInfo(orderInfoData); // set the order info state
        setModal2Open(true);
    };


    const showSuccessNotification = () => {
        notification.success({
            message: 'Success',
            description: 'Payment completed successfully!',
            placement: 'topRight', // แจ้งเตือนทางขวาบน
        });
    };

    return (
        <div>
            <section className='flexinput'>
                <label className='labelCash'>Cash</label>
                <input
                    type="text"
                    className='inputCash'
                    value={cash}
                    readOnly
                />
            </section>

            <section className='flexChange'>
                <label className='labelChange'>Change</label>
                <input
                    type='text'
                    className='inputChange'
                    value={change}
                    readOnly
                />
            </section>

            <section>
                <div className="flexNum">
                    {countNum().map(num => (
                        <button className="butN" key={num} onClick={() => calNum(num)}>
                            {num}
                        </button>
                    ))}
                    <button className="butN" onClick={handleDelete}>Delete</button>
                    <button className="butN" value={0} onClick={() => calNum(0)}>0</button>
                    <button className="butN" onClick={handleEnterClick}>Enter</button>
                </div>
            </section>

            {modal2Open === true && orderInfo
                ?
                <><PrintReceipt
                    orderData={orderInfo} />
                    <Modal
                        style={{ textAlign: "center" }}
                        centered
                        open={modal2Open}
                        onOk={() => {
                            setModal2Open(false);
                            createOrder(setOrderData, clearDataAll);
                            showSuccessNotification(); // แสดงแจ้งเตือนเมื่อกด OK

                        }}
                        cancelButtonProps={{ style: { display: 'none' } }}
                        closable={false}
                    >
                        <p style={{ fontSize: "30px" }}>PAYMENT SUCCESS</p>
                        <p style={{ fontSize: "30px" }}>CHANGE = {change}</p>
                    </Modal></>
                : modal2Open === false
            }

        </div>


    );
}

export default Cashmoney;
export { createOrder };
