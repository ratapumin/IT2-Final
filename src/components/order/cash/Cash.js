import { useState } from 'react';
import './Cash.css';
import Cashmoney from './Cashmoney';

function Cash({onCashChange}) {




    return (
        <div className="flexCash">
            <button className="btnClick">CASH</button>
            <Cashmoney
            onCashChange={onCashChange}
            />
            <button className="btnClick">PROMPTPAY</button>
            <button className="btnClick">MEMBER</button>
        </div>
    );
}

export default Cash;
