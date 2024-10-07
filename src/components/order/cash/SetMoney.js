import React from 'react';

const SetMoney = ({ configMoney }) => {
    const setmoney = [20, 50, 100, 500, 1000];

    const getButtonStyle = (amount) => {
        switch (amount) {
            case 20:
                return { backgroundColor: '#C8E6C9', borderColor: '#A5D6A7' }; // สีเขียว
            case 50:
                return { backgroundColor: '#BBDEFB', borderColor: '#90CAF9' }; // น้ำเงินฟ้า
            case 100:
                return { backgroundColor: '#FFCDD2', borderColor: '#EF9A9A' }; // แดง
            case 500:
                return { backgroundColor: '#E1BEE7', borderColor: '#D81B60' }; // ม่วง
            case 1000:
                return { backgroundColor: '#F5F5F5', borderColor: '#BDBDBD' }; // เทา
            default:
                return {};
        }
    };

    const handleClick = (amount) => {
        configMoney(amount); // เรียกใช้ configMoney เมื่อปุ่มถูกคลิก
        console.log(amount)
    };

    return (
        <div className='setMoneyContent'>
            {setmoney.map((amount) => {
                const { backgroundColor, borderColor } = getButtonStyle(amount);
                return (
                    <button
                        key={amount}
                        className='moneyButton'
                        style={{ backgroundColor, borderColor }}
                        onClick={() => handleClick(amount)} // เพิ่มการจัดการคลิกที่นี่
                    >
                        {amount}
                    </button>
                );
            })}
        </div>
    );
};

export default SetMoney;
