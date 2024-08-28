import React from 'react'; 
import { FaCoffee, FaLeaf, FaUser } from 'react-icons/fa';
import { GiChocolateBar,GiTakeMyMoney  } from "react-icons/gi";
import { IoLogOutOutline } from "react-icons/io5";

export const types = [  
  { name: 'Coffee', icon: <FaCoffee />, color: '#B5651D' }, 
  { name: 'Tea', icon: <FaLeaf />, color: '#6B8E23' }, 
  { name: 'Chocolate', icon: <GiChocolateBar />, color: '#D2691E' }, 
  { name: 'Member', icon: <FaUser />, color: '#4682B4' }, 
  { name: 'CloseDaily', icon: <GiTakeMyMoney />, color: '#A9A9A9' }, 
  { name: 'Logout', icon: <IoLogOutOutline  />, color: '#000000' }
];

function DrinkType({ selectedType, onTypeClick }) {
  return (
    <div className="menu-drink">
      {types.map((type) => (
        <h2
          key={type.name}
          className="drink-type"
          style={{
            backgroundColor: selectedType === type.name ? '#FFE8A3' : type.color, 
            border: `solid ${selectedType === type.name ? '#FFCD2B' : 'transparent'}`,
            color: '#FFFFFF' 
          }}
          onClick={() => onTypeClick(type.name)}
        >
       
          {React.cloneElement(type.icon, { style: { color: '#FFFFFF' } })}
        </h2>
      ))}
    </div>
  );
}

export default DrinkType;
