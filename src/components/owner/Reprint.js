import React, { useEffect, useState } from 'react';
import './reprint.css';
import axios from 'axios';
import { Empty } from 'antd';

function Reprint() {
    const [showOrderId, setShowOrderId] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [receipts, setReceipts] = useState([]);

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
                setReceipts(res.data);
            } catch (error) {
                console.log(error.response);
            }
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 }).format(value);
    }

    // จัดกลุ่มใบเสร็จตาม order_id
    const groupedReceipts = receipts.reduce((acc, receipt) => {
        const key = `${receipt.order_id}-${receipt.order_no}`; // ใช้ order_id และ order_no เป็น key
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(receipt);
        return acc;
    }, {});

    return (
        <div className='bgReprint'>
            <div className='contentReprint'>
                <div className='topReprintContent'>Reprint</div>
                <div className='centerReprintContent'>
                    <div className='centerReprintBox'></div>
                </div>
                <div className='bottomReprintContent'>
                    <div className='lefboxReprintContent'>
                        {showOrderId && showOrderId.length > 0 ? (
                            showOrderId.map((orderId, index) => (
                                <div
                                    key={`${orderId.order_id}-${index}`}
                                    className={`selectId ${selectedOrderId === orderId.order_id ? 'selected' : ''}`}
                                    onClick={() => handleSelect(orderId.order_id)}
                                >
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
                        {Object.keys(groupedReceipts).length > 0 ? (
                            Object.keys(groupedReceipts).map((key, index) => {
                                const [orderId, orderNo] = key.split('-'); // แยก order_id และ order_no
                                const firstReceipt = groupedReceipts[key][0]; // รับใบเสร็จแรกเพื่อใช้แสดงวันที่และเวลา

                                // แปลง order_date_time เป็นวันที่และเวลา
                                const dateTime = new Date(firstReceipt.order_date_time);
                                const date = dateTime.toISOString().split('T')[0]; // รูปแบบวันที่ YYYY-MM-DD
                                const time = `${dateTime.getUTCHours().toString().padStart(2, '0')}:${dateTime.getUTCMinutes().toString().padStart(2, '0')}:${dateTime.getUTCSeconds().toString().padStart(2, '0')}`; // รูปแบบเวลา HH:MM:SS

                                // คำนวณ subtotal
                                const subtotal = groupedReceipts[key].reduce((sum, receipt) => {
                                    return sum + (receipt.quantity * receipt.price);
                                }, 0);

                                return (
                                    <div key={index}>
                                        <p>Re-Print</p>
                                        <div>Emp: Ratapumin #{orderId} #{orderNo}</div>
                                        <div>Date: {date}</div> {/* แสดงวันที่ */}
                                        <div>Time: {time}</div> {/* แสดงเวลา */}
                                        <p>----------------------------------------------------------------------------------------</p>
                                        <div className='orderList'>
                                            <p>Item</p>
                                            <p>Type</p>
                                            <p>Qyt</p>
                                            <p>Amount</p>
                                        </div>

                                        {groupedReceipts[key].map((receipt, receiptIndex) => (
                                            <div
                                                className='orderList'
                                                key={receiptIndex}>
                                                <div>{receipt.p_id}</div>
                                                <div>{receipt.p_name}</div>
                                                <div>{receipt.quantity}</div>
                                                <div>{formatCurrency(receipt.quantity * receipt.price)}</div> {/* แสดงจำนวนเงินที่จัดรูปแบบแล้ว */}
                                            </div>
                                        ))}
                                        <p>----------------------------------------------------------------------------------------</p>
                                        <div className='ordertotal'>
                                            <p>Subtotal</p>
                                            <p>{formatCurrency(subtotal)}</p> {/* แสดง subtotal */}
                                            <p>Discount</p>
                                            <p>0</p>
                                            <p>Total</p>
                                            <p>{formatCurrency(subtotal)} {/* แสดง total สำหรับตอนนี้เป็น subtotal */}</p>
                                        </div>
                                        <p>----------------------------------------------------------------------------------------</p>
                                        <div className='orderthk'>
                                            <p>Thank you</p>
                                            <p>Please come again soon</p>
                                        </div>
                                    </div>
                                );
                            })
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
