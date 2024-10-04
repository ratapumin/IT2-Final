import React from 'react';
import axios from 'axios';

const PrintReceipt = () => {
    const [isPrinting, setIsPrinting] = React.useState(false); // สถานะการพิมพ์

    const handlePrint = async () => {
        if (isPrinting) return; // หากกำลังพิมพ์อยู่ให้ไม่ทำอะไร

        setIsPrinting(true); // เริ่มต้นสถานะการพิมพ์
        const content = "Receipt\nItem: U80II(U) 1\nThank you for your purchase!";

        try {
            const response = await axios.post('http://localhost:5000/api/print', {
                content: content
            });

            console.log(response.data);
            alert(response.data);
        } catch (error) {
            console.error("Error printing receipt:", error);
            alert("Failed to print. Please check the console for details.");
        } finally {
            setIsPrinting(false); // เปลี่ยนกลับสถานะเมื่อเสร็จสิ้น
        }
    };

    return (
        <div>
            <h1>Print Receipt</h1>
            <button onClick={handlePrint} disabled={isPrinting}>
                {isPrinting ? 'Printing...' : 'Print Receipt'}
            </button>
        </div>
    );
};


export default PrintReceipt;
