import { useState } from 'react';
import './Cashmoney.css';

function Cashmoney({ onCashChange }) {

    const [cash, setCash] = useState('')
    const countNum = () => {
        const number = [];
        for (let i = 1; i <= 9; i++) {
            number.push(i);
        }
        return number;
    };
    const calNum = (num) => {
        console.log(num)
        const newCash = cash + num.toString()
        setCash(newCash)
        onCashChange(newCash)

    }

    return (
        <div>


            <section className='flexinput'>
                <label className='labelCash'>CASH</label>
                <input
                    type="text"
                    className='inputCash'
                    value={cash}
                    readOnly
                />
            </section>

            <section >
                <div className="flexNum">
                    {countNum().map(num => (
                        <button className="butN" key={num} onClick={() => (
                            calNum(num)
                        )}>
                            {num}
                        </button>
                    ))}
                    <button className="butN">Delete</button>
                    <button className="butN" value={0} onClick={() => (
                        calNum(0)
                    )}>0</button>
                    <button className="butN">Enter</button>
                </div>




            </section>

        </div>
    );
}

export default Cashmoney;
