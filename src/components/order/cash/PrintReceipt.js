import { useState, useEffect } from 'react';
import axios from 'axios';

const PrintReceipt = ({ orderData }) => {
    const [isPrinting, setIsPrinting] = useState(false);
    const [orderInfor, setOrderInfor] = useState(null);

    useEffect(() => {
        if (orderData && orderData.order_id && orderData.products) {
            console.log(orderData);
            setOrderInfor({
                order_id: orderData.order_id || "",
                order_no: orderData.order_no || "",
                order_date_time: orderData.order_date_time || "",
                customer: orderData.customer || { name: "Unknown" },
                products: Array.isArray(orderData.products) ? orderData.products : [],
                history: Array.isArray(orderData.history) ? orderData.history : [],
                paymentMethod:orderData.payment_type
            });
        }
    }, [orderData]);

    useEffect(() => {
        if (orderInfor) {
            console.log("Sending data to server:", orderInfor);  // ตรวจสอบข้อมูลก่อนการส่ง request
            handlePrint();
        }
    }, [orderInfor]);

const handlePrint = async () => {
    if (isPrinting || !orderInfor) return; // หากยังอยู่ในระหว่างการพิมพ์หรือไม่มี orderInfor ให้ return
    setIsPrinting(true);

    try {
        const response = await axios.post('http://localhost:5000/api/print', {
            order_id: orderInfor.order_id,
            order_no: orderInfor.order_no,
            order_date_time: orderInfor.order_date_time,
            customer: orderInfor.customer,
            products: orderInfor.products,
            history: orderInfor.history,
            paymentMethod:orderInfor.paymentMethod
        });

        console.log(response.data);
        // alert(response.data.message);
    } catch (error) {
        console.error("Error printing receipt:", error);
        // alert("Failed to print. Please check the console for details.");
    } finally {
        setIsPrinting(false);
    }
};


    return null

};

export default PrintReceipt;
