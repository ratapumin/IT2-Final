import React, { useEffect, useState } from 'react';
import './reprint.css';
import axios from 'axios';
import { Button, Empty } from 'antd';

function Reprint() {
    const [showOrderId, setShowOrderId] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [receipts, setReceipts] = useState([]);
    const [statusPrint, setStatusPrint] = useState('');
    const [productList, setProductList] = useState([])

    useEffect(() => {
        const fetchOrderId = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/showorderid');
                setShowOrderId(res.data);
            } catch (error) {
                console.log(error.response);
            }
        };
        fetchOrderId();
    }, []);

    const handleSelect = async (orderId) => {
        setReceipts([]);

        if (selectedOrderId === orderId) {
            setSelectedOrderId(null);
        } else {
            setSelectedOrderId(orderId);
            try {
                const res = await axios.post(`http://localhost:5000/api/reprintreceipt/${orderId}`);
                console.log(res.data);
                setReceipts(res.data.PointHistoryResult || []); // ถ้าไม่มีข้อมูลให้เป็น []
                setProductList(res.data.ReceiptResult || []);  // ถ้าไม่มีข้อมูลให้เป็น []
                console.log(res.data.ReceiptResult);
            } catch (error) {
                console.log(error.response);
            }
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 }).format(value);
    };

    const formatDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const localDateTime = new Date(dateTime.getTime() + (7 * 60 * 60 * 1000)); // เพิ่ม 7 ชั่วโมงเพื่อแปลงเป็นเวลาท้องถิ่น

        const date = localDateTime.toISOString().split('T')[0]; // รูปแบบวันที่ YYYY-MM-DD
        const time = `${localDateTime.getUTCHours().toString().padStart(2, '0')}:${localDateTime.getUTCMinutes().toString().padStart(2, '0')}:${localDateTime.getUTCSeconds().toString().padStart(2, '0')}`; // รูปแบบเวลา HH:MM:SS
        return { date, time };
    };

    const setReprintReceipt = () => {
        if (!receipts || receipts.length === 0) {
            return {
                user_fname: '',
                order_id: '',
                order_no: '',
                order_date: '',
                order_time: '',
                products: [],
                subtotal: '0.00',
                discount: '0.00',
                total: '0.00',
                customer: null,
                pointsEarned: 0,
                pointsRedeemed: 0
            };
        }

        const firstReceipt = receipts[0];
        const { date, time } = formatDateTime(firstReceipt.order_date_time);

        const subtotal = productList.reduce((sum, product) => {
            return sum + (product.quantity * parseFloat(product.price));
        }, 0);
        



        const earnedPoints = receipts.find(receipt => receipt.type === "earn")?.points || 0;
        const redeemedPoints = receipts.find(receipt => receipt.type === "redeem")?.points || 0;

        const hasCustomer = firstReceipt.c_fname && firstReceipt.c_lname;
        const discount = redeemedPoints ? 5 : 0;
        const total = formatCurrency(subtotal - discount);


        return {
            user_fname: firstReceipt.user_fname,
            order_id: firstReceipt.order_id,
            order_no: firstReceipt.order_no,
            order_date: date,
            order_time: time,
            products: productList.map(product => ({
                p_id: product.p_id,
                p_name: product.p_name,
                p_price: product.price,
                category: product.category,
                quantity: product.quantity
            })),
            subtotal: formatCurrency(subtotal),
            discount: redeemedPoints ? 5 : 0,
            total: total,
            customer: hasCustomer ? `${firstReceipt.c_fname} ${firstReceipt.c_lname}` : null,
            pointsEarned: earnedPoints,
            pointsRedeemed: redeemedPoints
        };
    };




    const handleReprintReceipt = async () => {
        const receiptData = setReprintReceipt();
        console.log(receiptData);
        setStatusPrint('print')

        try {
            const res = await axios.post('http://localhost:5000/api/printReceipt/', {
                receiptData,
                statusPrint: statusPrint
            });

            console.log(res.data); // Log the response from the server
            statusPrint('no')
        } catch (error) {
            console.error("Error in reprinting receipt:", error); // Handle error appropriately
        }
    }

    const receiptData = setReprintReceipt(receipts, productList);
    // console.log(receiptData.total)


    return (
        <div className='bgReprint'>
            <div className='contentReprint'>
                <div className='topReprintContent'>Reprint</div>
                <div className='centerReprintContent'>
                    <div className='centerReprintBox'>
                        <Button type='primary' onClick={handleReprintReceipt}>Print receipt</Button>
                    </div>
                </div>
                <div className='bottomReprintContent'>
                    <div className='lefboxReprintContent'>
                        {showOrderId && showOrderId.length > 0 ? (
                            showOrderId.map((orderId, index) => (
                                <div key={`${orderId.order_id}-${index}`}
                                    className={`selectId ${selectedOrderId === orderId.order_id ? 'selected' : ''}`}
                                    onClick={() => handleSelect(orderId.order_id)}>
                                    {orderId.order_id}
                                </div>
                            ))
                        ) : (
                            <p className='nodata'>
                                <Empty />
                            </p>
                        )}
                    </div>
                    <div className='boxReprintContent'>
                        {receiptData ? (
                            <>
                                <p style={{ textAlign: 'center', width: '60%', fontWeight: "bold", fontSize: "30px" }}>Re-Print</p>
                                <div>Emp: {receiptData.user_fname} #{receiptData.order_id} #{receiptData.order_no}</div>
                                <div>Date: {receiptData.order_date}</div>
                                <div>Time: {receiptData.order_time}</div>
                                <p>----------------------------------------------------------------------------------------</p>
                                <div className='orderList'>
                                    <p>Item</p>
                                    <p>Type</p>
                                    <p>Qty</p>
                                    <p>Amount</p>
                                </div>
                                {receiptData.products.map(product => (
                                    <div key={product.p_id} className='orderList'>
                                        <div>{product.p_name}</div>
                                        <div>{product.category}</div>
                                        <div>{product.quantity}</div>
                                        <div>{formatCurrency(product.quantity * product.p_price)}</div>
                                    </div>
                                ))}
                                <p>----------------------------------------------------------------------------------------</p>
                                <div className='ordertotal'>
                                    <p>Subtotal</p>
                                    <p>{receiptData.subtotal}</p>
                                    <p>Discount</p>
                                    <p>{receiptData.pointsRedeemed ? '5' : 0}</p>
                                    <p>Total</p>
                                    <p>{receiptData.total}</p>
                                </div>
                                {receiptData.customer && (
                                    <>
                                        <p>----------------------------------------------------------------------------------------</p>
                                        <p>Customer: {receiptData.customer}</p>
                                    </>
                                )}
                                {(receiptData.pointsEarned > 0 || receiptData.pointsRedeemed > 0) && (
                                    <>
                                        <p style={{ textAlign: 'center', width: '60%' }}>*** Point ***</p>
                                        <div className='orderPoints'>
                                            <p>Collect: {receiptData.pointsEarned}</p>
                                            <p>Redeem: {receiptData.pointsRedeemed}</p>
                                        </div>
                                    </>
                                )}
                                <>
                                    <p>----------------------------------------------------------------------------------------</p>
                                    <div className='orderthk'>
                                        <p>Thank you</p>
                                        <p>Please come again soon</p>
                                    </div>
                                </>
                            </>
                        ) : (

                            <p className='nodata'>
                                <Empty />
                            </p>

                        )}
                    </div>
                </div>
            </div>
        </div>
    );


}

export default Reprint;



