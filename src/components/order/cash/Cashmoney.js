import { useEffect, useState } from 'react';
import './Cashmoney.css';
import axios from 'axios';
import { useUser } from '../../user/UserContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Modal } from 'antd';

function Cashmoney({ onCashChange, products, sumCash, onChange, onDeleteAll,
    selectedType, sentMember, resetMember, getPoints, redeemPoints
}) {
    const [orderId, setOrderId] = useState('');
    const [orderNo, setOrderNo] = useState('');
    const navigate = useNavigate();
    const { user } = useUser();
    const [cash, setCash] = useState('');
    const [change, setChange] = useState('');
    const [modal2Open, setModal2Open] = useState(false);
    // const [currentMember, setCurrentMember] = useState()
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
        // console.log('collectPoints', collectPoints);
        console.log('getPoints', getPoints);
        console.log('redeemPoints', redeemPoints);
    }, [getPoints]);


    const calNum = (num) => {
        const newCash = cash + num.toString();
        setCash(newCash);
        onCashChange(newCash);
        console.log("Updated Cash in calNum:", newCash);
    };

    useEffect(() => {
        if (cash && sumCash) {
            const changeAmount = Number(cash) - Number(sumCash);
            setChange(changeAmount > 0 ? changeAmount : 0);
            onChange(changeAmount > 0 ? changeAmount : 0);
            console.log("Calculated Change:", changeAmount);
        }
    }, [cash, sumCash, onChange]);

    const handleDelete = () => {
        const newCash = cash.slice(0, -1);
        setCash(newCash);
        onCashChange(newCash);
        console.log("Updated Cash after Delete:", newCash);
    };
    // const currentDate = moment().format('YYYYMMDD');
    // console.log(currentDate)
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
            payment_type: 'cash',
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



    const createOrder = async () => {
        try {
            const orderData = setOrderData();
            await axios.post('http://localhost:5000/api/createOrder', orderData);
            console.log('Order created successfully');
            console.log('Order Data:', orderData);
        } catch (error) {
            console.error('Error creating order:', error);
        }
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
                    <button className="butN" onClick={() => {
                        createOrder();
                        setModal2Open(true);
                    }}>Enter</button>
                </div>
            </section>

            <Modal

                style={{ textAlign: "center" }}
                centered
                open={modal2Open}
                onOk={() => {
                    setModal2Open(false);
                    setCash('');
                    setChange('');
                    onDeleteAll();
                    resetMember()
                    selectedType('Coffee')


                }}
                cancelButtonProps={{ style: { display: 'none' } }}
                closable={false}
            >
                <p style={{ fontSize: "30px" }}>
                    PAYMENT SUCCESS
                </p>
                <p style={{ fontSize: "30px" }}>
                    CHANGE = {change}
                </p>
            </Modal>

        </div>
    );
}

export default Cashmoney;
