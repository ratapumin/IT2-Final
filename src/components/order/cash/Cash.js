import './Cash.css'; 
import Cashmoney from './Cashmoney';

function Cash() {
    return (
        <div className="flexCash">
            <button className="btnClick">CASH</button>
            <Cashmoney/>
            <button className="btnClick">PROMPTPAY</button>
            <button className="btnClick">MEMBER</button>
        </div>
    );
}

export default Cash;
