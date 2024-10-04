import React from 'react';
import axios from 'axios';

const PrintReceipt = () => {
    const handlePrint = async () => {
        const content = "Receipt\nItem: U80II(U) 1\nThank you for your purchase!"; // ข้อมูลที่คุณต้องการส่งไปยัง API

        try {
            // เรียก API สำหรับการพิมพ์
            const response = await axios.post('http://localhost:5000/api/print', {
                content: content
            });

            // แสดงผลการพิมพ์ใน console
            console.log(response.data);
            alert(response.data); // แสดงข้อความที่ส่งกลับจากเซิร์ฟเวอร์
        } catch (error) {
            console.error("Error printing receipt:", error);
            alert("Failed to print. Please check the console for details.");
        }
    };

    return (
        <div>
            <h1>Print Receipt</h1>
            <button onClick={handlePrint}>Print Receipt</button>
        </div>
    );
};

export default PrintReceipt;
