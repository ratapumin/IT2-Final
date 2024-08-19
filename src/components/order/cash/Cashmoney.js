import { useEffect, useState } from 'react';
import './Cashmoney.css';
import axios from 'axios';
import { useUser } from '../../user/UserContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function Cashmoney({ onCashChange, products }) {
    const [orderId, setOrderId] = useState('')
    const [orderNo, setOrderNo] = useState('')
    const navigate = useNavigate();
    const { user } = useUser();
    useEffect(() => {
        if (!user || user.role === 'O') {
            navigate('/protected');
        }
    }, [user, navigate]);
    console.log(user)


    const [cash, setCash] = useState('');

    const countNum = () => {
        const number = [];
        for (let i = 1; i <= 9; i++) {
            number.push(i);
        }
        return number;
    };

    const calNum = (num) => {
        const newCash = cash + num.toString();
        setCash(newCash);
        onCashChange(newCash);
    };

    useEffect(() => {
        const fetchOrderId = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/readorder");

                const filterOrderId = res.data.map(order => parseInt(order.order_id, 10)).filter(id => !isNaN(id));
                const filterOrderNo = res.data.map(order => parseInt(order.order_no, 10)).filter(no => !isNaN(no));


                if (filterOrderId.length === 0) {
                    setOrderId('0001');
                } else {
                    const maxId = Math.max(...filterOrderId);
                    const newId = (maxId + 1).toString().padStart(4, '0');
                    setOrderId(newId);
                }

                // คำนวณ order_no
                if (filterOrderNo.length === 0) {
                    setOrderNo('001');
                } else {
                    const maxNo = Math.max(...filterOrderNo);
                    const newNo = (maxNo + 1).toString().padStart(3, '0');
                    setOrderNo(newNo);
                }
            } catch (error) {
                console.log("Cannot fetch order", error);
            }
        };

        fetchOrderId();
    }, []);



    console.log('eee', orderId)
    console.log(orderNo)




    const setOrderData = () => {
        return {
            order_id: orderId,
            order_no: orderNo,
            order_date_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            payment_type: 'cash',
            user_id: user.user_id,
            c_id: null,
            products: products.map(product => ({
                p_id: product.p_id,
                p_price: product.p_price,
                quantity: product.quantity
            }))
        };
    };
    // console.log(order)

    const createOrder = async () => {
        const orderData = setOrderData();
        try {
            const res = await axios.post('http://localhost:5000/api/createOrder', orderData);
            console.log('Order created successfully:', res.data);
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };





    return (
        <div>
            <section className='flexinput'>
                <label className='labelCash'>CASH</label>
                <input
                    type="text"
                    className='inputCash'
                    value={cash}
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
                    <button className="butN">Delete</button>
                    <button className="butN" value={0} onClick={() => calNum(0)}>0</button>
                    <button className="butN"
                        onClick={createOrder}
                    >Enter</button>
                </div>
            </section>
        </div>
    );
}

export default Cashmoney;
