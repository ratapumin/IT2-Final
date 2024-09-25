import { useEffect, useState } from 'react';
import './Cashmoney.css';
import axios from 'axios';
import { useUser } from '../../user/UserContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Modal, notification } from 'antd';
import { create } from 'qrcode';


function CreateOrder({ onCashChange, products, sumCash, onChange, onDeleteAll,
    selectedType, sentMember, resetMember, getPoints, redeemPoints, paymenMethod,
    clearOrder, showCreateOrder }) {
    const [orderId, setOrderId] = useState('');
    const [orderNo, setOrderNo] = useState('');
    const { user } = useUser();
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
            payment_type: paymenMethod,
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

    const orderData = setOrderData()
    console.log(orderData)
    useEffect(() => {
        if (showCreateOrder === true) {
            console.log('showCreateOrder ture')
            createOrder(setOrderData)
        }
    }, [showCreateOrder])

    const createOrder = async (setOrderData) => {
        try {
            const orderData = setOrderData();
            await axios.post('http://localhost:5000/api/createOrder', orderData);
            console.log('Order created successfully');
            console.log('Order Data:', orderData);
            clearOrder()
        } catch (error) {
            console.error('Error creating order:', error.response ? error.response.data : error.message);
        }
    };
    return null; // No UI elements needed here
}


export default CreateOrder