import { useEffect } from 'react';
import './Cash.css';
import Cashmoney from './Cashmoney';

function Cash({ onCashChange, products, sumCash, onChange }) {

    return (
        <div className="flexCash">
            <button className="btnClick">CASH</button>
            <Cashmoney
                onCashChange={onCashChange}
                products={products}
                sumCash={sumCash}
                onChange={onChange}
            />
            <button className="btnClick">PROMPTPAY</button>
            <button className="btnClick">MEMBER</button>
        </div>
    );
}

export default Cash;
