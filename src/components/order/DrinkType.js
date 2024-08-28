import React from 'react'; // อย่าลืม import React ถ้าไม่ได้ import ไว้ก่อน
import { FaCoffee, FaLeaf, FaUser } from 'react-icons/fa';
import { GiChocolateBar,GiTakeMyMoney  } from "react-icons/gi";
import { IoLogOutOutline } from "react-icons/io5";

export const types = [  // เปลี่ยนเป็น export const types
  { name: 'Coffee', icon: <FaCoffee />, color: '#B5651D' }, // สีน้ำตาลสำหรับกาแฟ
  { name: 'Tea', icon: <FaLeaf />, color: '#6B8E23' }, // สีเขียวสำหรับชา
  { name: 'Chocolate', icon: <GiChocolateBar />, color: '#D2691E' }, // สีช็อคโกแลต
  { name: 'Member', icon: <FaUser />, color: '#4682B4' }, // สีน้ำเงินสำหรับเมมเบอร์
  { name: 'Close Daily', icon: <GiTakeMyMoney />, color: '#A9A9A9' }, // สีเทาสำหรับปิดร้าน
  { name: 'Logout', icon: <IoLogOutOutline  />, color: '#000000' } // logout
];

function DrinkType({ selectedType, onTypeClick }) {
  return (
    <div className="menu-drink">
      {types.map((type) => (
        <h2
          key={type.name}
          className="drink-type"
          style={{
            backgroundColor: selectedType === type.name ? '#FFE8A3' : type.color, // ใช้สีพื้นหลังตามที่กำหนด
            border: `solid ${selectedType === type.name ? '#FFCD2B' : 'transparent'}`,
            color: '#FFFFFF' // สีข้อความเป็นสีขาว
          }}
          onClick={() => onTypeClick(type.name)}
        >
          {/* ไอคอนจะใช้สีขาวตาม style ของ h2 */}
          {React.cloneElement(type.icon, { style: { color: '#FFFFFF' } })} {/* ไอคอนเป็นสีขาว */}
        </h2>
      ))}
    </div>
  );
}

export default DrinkType;
