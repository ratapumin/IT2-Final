import './Cash.css';
import Cashmoney from './Cashmoney';

function Cash({ onCashChange, products, sumCash, onChange, onDeleteAll ,selectedType}) {

    return (
        <div className="flexCash">
            <button className="btnClick">POINTS</button>
            <Cashmoney
                onCashChange={onCashChange}
                products={products}
                sumCash={sumCash}
                onChange={onChange}
                onDeleteAll={onDeleteAll} // แก้ไขตรงน
                selectedType={selectedType}
            />
            <button className="btnClick">CASH</button>
            <button className="btnClick">PROMPTPAY</button>
        </div>
    );
}

export default Cash;
