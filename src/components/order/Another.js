import { useNavigate } from "react-router-dom";
import { useUser } from '../user/UserContext';
import CloseDaily from './cash/CloseDaily';
import { useEffect, useState } from 'react';

function Another({ selectedType }) {
    const [token, setToken] = useState();
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        if (!user || (user.role_type === 'O' && user.role_type === 'E')) {
            navigate('/protected');
        }
    }, [user, navigate]);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            setToken(token);
        } else {
            navigate("/");
        }
    }, [token, navigate]);

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
                    {/* แสดงปุ่ม Dashboard เฉพาะเมื่อ role_type ไม่ใช่ E */}
                    {user && user.role_type !== 'E' && (
                        <button className="product-box" style={{ background: backgroundColor }}
                            onClick={() => {
                                navigate('/dashboard');
                            }}
                        >
                            Dashboard
                        </button>
                    )}
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
