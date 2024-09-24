import { useEffect, useState } from 'react';
import './Cashmoney.css';
import axios from 'axios';
import { useUser } from '../../user/UserContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Modal } from 'antd';

function Cashmoney({ onCashChange, products, sumCash, onChange, onDeleteAll,
    selectedType, sentMember, resetMember, getPoints, redeemPoints
}) {
    const [orderId, setOrderId] = useState('');
    const [orderNo, setOrderNo] = useState('');
    const navigate = useNavigate();
    const { user } = useUser();
    const [cash, setCash] = useState('');
    const [change, setChange] = useState('');
    const [modal2Open, setModal2Open] = useState(false);
    // const [currentMember, setCurrentMember] = useState()
    useEffect(() => {
        if (!user || user.role === 'O') {
            navigate('/protected');
        }
    }, [user, navigate]);

    const countNum = () => {
        const number = [];
        for (let i = 1; i <= 9; i++) {
            number.push(i);
        }
        return number;
    };
    useEffect(() => {
        // console.log('collectPoints', collectPoints);
        console.log('getPoints', getPoints);
        console.log('redeemPoints', redeemPoints);
    }, [getPoints]);


    const calNum = (num) => {
        const newCash = cash + num.toString();
        setCash(newCash);
        onCashChange(newCash);
        console.log("Updated Cash in calNum:", newCash);
    };

    useEffect(() => {
        if (cash && sumCash) {
            const changeAmount = Number(cash) - Number(sumCash);
            setChange(changeAmount > 0 ? changeAmount : 0);
            onChange(changeAmount > 0 ? changeAmount : 0);
            console.log("Calculated Change:", changeAmount);
        }
    }, [cash, sumCash, onChange]);

    const handleDelete = () => {
        const newCash = cash.slice(0, -1);
        setCash(newCash);
        onCashChange(newCash);
        console.log("Updated Cash after Delete:", newCash);
    };
    // const currentDate = moment().format('YYYYMMDD');
    // console.log(currentDate)


    return (
        <div>
            <section className='flexinput'>
                <label className='labelCash'>Cash</label>
                <input
                    type="text"
                    className='inputCash'
                    value={cash}
                    readOnly
                />
            </section>

            <section className='flexChange'>
                <label className='labelChange'>Change</label>
                <input
                    type='text'
                    className='inputChange'
                    value={change}
                    readOnly
                />
            </section>

            <section>
                <div className="flexNum">
                    {countNum().map(num => (
                        <button className="butN" key={num} onClick={() => calNum(num)}>
                            {num}
                        </button>
                    ))}
                    <button className="butN" onClick={handleDelete}>Delete</button>
                    <button className="butN" value={0} onClick={() => calNum(0)}>0</button>
                    <button className="butN" onClick={() => {
                        // createOrder();
                        setModal2Open(true);
                    }}>Enter</button>
                </div>
            </section>

            <Modal

                style={{ textAlign: "center" }}
                centered
                open={modal2Open}
                onOk={() => {
                    setModal2Open(false);
                    setCash('');
                    setChange('');
                    onDeleteAll();
                    resetMember()
                    selectedType('Coffee')


                }}
                cancelButtonProps={{ style: { display: 'none' } }}
                closable={false}
            >
                <p style={{ fontSize: "30px" }}>
                    PAYMENT SUCCESS
                </p>
                <p style={{ fontSize: "30px" }}>
                    CHANGE = {change}
                </p>
            </Modal>

        </div>
    );
}

export default Cashmoney;
