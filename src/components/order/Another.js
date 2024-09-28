import { Button } from 'antd';
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

import CloseDaily from './cash/CloseDaily';
import { useState } from 'react';

function Another({ selectedType }) {
    const navigate = useNavigate();
    const [isCloseDailyOpen, setIsCloseDailyOpen] = useState(false); // สร้าง state สำหรับควบคุม modal

    const backgroundColor = '#4682B4';

    const handleOpenCloseDaily = () => {
        setIsCloseDailyOpen(true); // เปิด modal
    };

    const handleCloseDaily = () => {
        setIsCloseDailyOpen(false); // ปิด modal
    };

    return (
        <>
            <section className="product-section">
                <div className="product-flex">
                    <button className="product-box" style={{ background: backgroundColor }}
                        onClick={() => {
                            navigate('/dashboard');
                        }}
                    >
                        Dashboard
                    </button>
                </div>

                <div className="product-flex">
                    <button className="product-box" style={{ background: backgroundColor }}
                        onClick={() => {
                            navigate('/members');
                        }}
                    >
                        Members
                    </button>
                </div>

                {/* ปุ่มสำหรับเปิด CloseDaily modal */}
                <div className="product-flex">
                    <button className="product-box" style={{ background: backgroundColor }}
                        onClick={handleOpenCloseDaily}
                    >
                        Close Daily
                    </button>
                </div>
            </section>

            {/* เรียก CloseDaily modal */}
            <CloseDaily CloseDaily={isCloseDailyOpen} handleCloseDaily={handleCloseDaily} />
        </>
    );
}

export default Another;