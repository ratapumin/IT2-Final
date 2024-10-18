import React, { useEffect, useState } from 'react';
import './reprint.css';
import axios from 'axios';
import { Button, Empty } from 'antd';

function Reprint() {
    const [showOrderId, setShowOrderId] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [receipts, setReceipts] = useState([]);
    const [statusPrint, setStatusPrint] = useState('');

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
    };

    const formatDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const localDateTime = new Date(dateTime.getTime() + (7 * 60 * 60 * 1000)); // เพิ่ม 7 ชั่วโมงเพื่อแปลงเป็นเวลาท้องถิ่น

        const date = localDateTime.toISOString().split('T')[0]; // รูปแบบวันที่ YYYY-MM-DD
        const time = `${localDateTime.getUTCHours().toString().padStart(2, '0')}:${localDateTime.getUTCMinutes().toString().padStart(2, '0')}:${localDateTime.getUTCSeconds().toString().padStart(2, '0')}`; // รูปแบบเวลา HH:MM:SS
        return { date, time };
    };

    // จัดกลุ่มใบเสร็จตาม order_id
    const groupedReceipts = receipts.reduce((acc, receipt) => {
        const key = `${receipt.order_id}-${receipt.order_no}-${receipt.user_fname}`; // ใช้ order_id และ order_no เป็น key
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(receipt);
        return acc;
    }, {});


    const setReprintReceipt = () => {
        if (receipts.length === 0) {
            return null;
        }

        const firstReceipt = receipts[0];
        const { date, time } = formatDateTime(firstReceipt.order_date_time);

        const subtotal = receipts.reduce((sum, receipt) => {
            return sum + (receipt.quantity * receipt.price);
        }, 0);

        // หาคะแนนที่ได้รับ (earn) จากใบเสร็จแรกที่พบ
        const earnedPoints = receipts.find(receipt => receipt.type === "earn")?.points || 0;

        // หาคะแนนที่ใช้ (redeem) จากใบเสร็จแรกที่พบ
        const redeemedPoints = receipts.find(receipt => receipt.type === "redeem")?.points || 0;

        console.log(`Collect: ${earnedPoints}`);
        console.log(`Redeem: ${Math.abs(redeemedPoints)}`);

        const pointsEarned = earnedPoints;  // ใช้คะแนนที่ได้รับจากใบเสร็จแรก
        const pointsRedeemed = redeemedPoints  // ใช้คะแนนที่ใช้จากใบเสร็จแรก โดยใช้ค่าเป็นบวก

        const hasCustomer = firstReceipt.c_fname && firstReceipt.c_lname;

        return {
            user_fname: firstReceipt.user_fname,
            order_id: firstReceipt.order_id,
            order_no: firstReceipt.order_no,
            order_date: date,
            order_time: time,
            products: receipts.map(receipt => ({
                p_id: receipt.p_id,
                p_name: receipt.p_name,
                p_price: receipt.price,
                category: receipt.category,
                quantity: receipt.quantity
            })),
            subtotal: formatCurrency(subtotal),
            discount: pointsRedeemed > 0 ? 5 : 0,
            total: pointsRedeemed > 0 ? formatCurrency(subtotal - 5) : formatCurrency(subtotal),
            customer: hasCustomer ? `${firstReceipt.c_fname} ${firstReceipt.c_lname}` : null,
            pointsEarned,  // ส่งค่า pointsEarned ตรง ๆ
            pointsRedeemed  // ส่งค่า pointsRedeemed ตรง ๆ
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




    return (
        <div className='bgReprint'>
            <div className='contentReprint'>
                <div className='topReprintContent'>Reprint</div>
                <div className='centerReprintContent'>
                    <div className='centerReprintBox'>
                        <Button type='primary'
                            onClick={() => {
                                handleReprintReceipt()
                            }}
                        >Prinnt receipt</Button>
                    </div>
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
                                const [orderId, orderNo, userFname] = key.split('-'); // แยก order_id และ order_no
                                const firstReceipt = groupedReceipts[key][0]; // รับใบเสร็จแรกเพื่อใช้แสดงวันที่และเวลา

                                const { date, time } = formatDateTime(firstReceipt.order_date_time);

                                const subtotal = groupedReceipts[key].reduce((sum, receipt) => {
                                    return sum + (receipt.quantity * receipt.price);
                                }, 0);

                                const hasCustomer = firstReceipt.c_fname && firstReceipt.c_lname;

                                const pointsEarned = groupedReceipts[key]
                                    .filter((receipt) => receipt.type === 'earn')
                                    .slice(0, 1) // นับแค่ใบเสร็จแรกของประเภท 'earn'
                                    .reduce((sum, receipt) => sum + receipt.points, 0);

                                const pointsRedeemed = groupedReceipts[key]
                                    .filter((receipt) => receipt.type === 'redeem')
                                    .slice(0, 1) // นับแค่ใบเสร็จแรกของประเภท 'redeem'
                                    .reduce((sum, receipt) => sum + receipt.points, 0);


                                // const currentPoints = pointsEarned - -pointsRedeemed;

                                return (
                                    <div key={index}>
                                        <p style={{ textAlign: 'center', width: '60%', fontWeight: "bold", fontSize: "30px" }}>Re-Print</p>
                                        <div>Emp: {userFname.charAt(0).toUpperCase() + userFname.slice(1)} #{orderId} #{orderNo}</div>
                                        <div>Date: {date}</div>
                                        <div>Time: {time}</div>
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
                                                <div>{receipt.p_name}</div>
                                                <div>{receipt.category}</div>
                                                <div>{receipt.quantity}</div>
                                                <div>{formatCurrency(receipt.quantity * receipt.price)}</div> {/* แสดงจำนวนเงินที่จัดรูปแบบแล้ว */}
                                            </div>
                                        ))}
                                        <p>----------------------------------------------------------------------------------------</p>
                                        <div className='ordertotal'>
                                            <p>Subtotal</p>
                                            <p>{formatCurrency(subtotal)}</p>
                                            <p>Discount</p>
                                            <p>{pointsRedeemed ? '5' : 0}</p>
                                            <p>Total</p>
                                            <p>{pointsRedeemed ? formatCurrency(subtotal - 5) : formatCurrency(subtotal)}</p>
                                        </div>
                                        <p>----------------------------------------------------------------------------------------</p>

                                        {hasCustomer ? (
                                            <>
                                                <div>
                                                    <p>Customer: {firstReceipt.c_fname} {firstReceipt.c_lname}</p>
                                                </div>
                                                <p style={{ textAlign: 'center', width: '60%' }}>*** Point ***</p>
                                                <div className='orderPoints'>
                                                    <p>Collect: {pointsEarned}</p>
                                                    <p>Redeem: {pointsRedeemed ? `${pointsRedeemed}` : 0}</p>
                                                </div>
                                            </>
                                        ) : null}


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
