import { useEffect, useState } from 'react';
import './Cash.css';
import Cashmoney from './Cashmoney';
import { Modal, Form, Input, Button } from 'antd';
import './Payment.css';
import axios from 'axios';

function Cash({
    onCashChange, products, sumCash, onChange, onDeleteAll, selectedType,
    OnsaveMember, resetMember, onGetPoints, redeemPoints, getPoints, onRedeemPoints

}) {
    const [points, setPoints] = useState(false);
    const [collect, setCollect] = useState(false);
    const [redeem, setRedeem,] = useState(false);

    const [tel, setTel] = useState('');
    const [contactName, setContactName] = useState('');
    const [members, setMembers] = useState([])
    const [currentMember, setCurrentMember] = useState()



    const fetchMembers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/members')
            console.log(res.data)
            setMembers(res.data)
        } catch (error) {
            console.log("Cannot fetch Members", error);
        }
    }
    useEffect(() => {
        // console.log('collectPoints', collectPoints);
        // console.log('getPoints', onGetPoints);
        console.log('redeemPoints', redeemPoints);
    }, [redeemPoints]);


    useEffect(() => {
        fetchMembers()
    }, [])

    const handleTelChange = (e) => {
        setTel(e.target.value);
    };

    const handleSearch = () => {
        const member = members.find(member => member.c_tel === tel);
        setCurrentMember(member)
        setContactName(member ? `${member.c_fname}  ${member.c_lname} Points: ${member.c_points}` : 'ไม่พบข้อมูล');
        console.log('findmember', member)
    };

    const handleSelectMemberCollect = () => {
        const member = members.find(member => member.c_tel === tel);
        setCurrentMember(member)
        console.log('findmember', member)
        OnsaveMember(member)
        if (member) {
            onGetPoints(member)
        }
        setCollect(false)
    };


    const handleSelectMemberRedeem = () => {
        const member = members.find(member => member.c_tel === tel);
        setCurrentMember(member)
        console.log('findmember', member)
        OnsaveMember(member)
        if (member) {
            onRedeemPoints(member)
        }
        setRedeem(false)
    };


    const handleCollect = () => {
        setCollect(false);
        setTel('');
        setContactName('');
    };

    const handleRedeem = () => {
        setRedeem(false);
        setTel('');
        setContactName('');
    };

    return (
        <div className="flexCash">
            <button
                className="btnClick"
                onClick={() => {
                    setPoints(true);

                }
                }
            >POINTS</button>
            <Cashmoney
                onCashChange={onCashChange}
                products={products}
                sumCash={sumCash}
                onChange={onChange}
                onDeleteAll={onDeleteAll}
                selectedType={selectedType}
                sentMember={currentMember}
                resetMember={resetMember}
                // collectPoints={collectPoints}
                getPoints={getPoints}
                redeemPoints={redeemPoints}
            />
            <button className="btnClick">CASH</button>
            <button className="btnClick">PROMPTPAY</button>
            <Modal
                title="Points"
                style={{ textAlign: "center" }}
                centered
                open={points}
                onOk={() => setPoints(false)}
                cancelButtonProps={{ style: { display: 'none' } }}
                closable={false}
            >
                <button
                    className='btnCollect'
                    onClick={() => setCollect(true)}
                >
                    Collect
                </button>
                <button
                    className='btnRedeem'
                    onClick={() => setRedeem(true)}
                >
                    Redeem
                </button>
            </Modal>

            <Modal
                title="Collect Points"
                style={{ textAlign: "center" }}
                centered
                open={collect}
                onOk={handleSearch}
                footer={[
                    <Button key="search" onClick={handleSearch}>
                        Search
                    </Button>,
                    <Button key="select" type="primary" onClick={handleSelectMemberCollect}>
                        Submit
                    </Button>
                ]}
                onCancel={() => handleCollect()}
                cancelButtonProps={{ style: { display: 'none' } }}
            // closable={false}
            >
                <Form>
                    <Form.Item>
                        <Input
                            placeholder='Tel.'
                            type='text'
                            name='tel'
                            value={tel}
                            onChange={handleTelChange}
                        />
                    </Form.Item>
                    {contactName && <p>Name: {contactName}</p>}
                </Form>
            </Modal>


            <Modal
                title="Redeem Points"
                style={{ textAlign: "center" }}
                centered
                open={redeem}
                onOk={handleSearch}
                footer={[
                    <Button key="search" onClick={handleSearch}>
                        Search
                    </Button>,
                    <Button key="select" type="primary" onClick={handleSelectMemberRedeem}>
                        Submit
                    </Button>
                ]}
                onCancel={() => handleRedeem()}
                cancelButtonProps={{ style: { display: 'none' } }}
            // closable={false}
            >
                <Form>
                    <Form.Item>
                        <Input
                            placeholder='Tel.'
                            type='text'
                            name='tel'
                            value={tel}
                            onChange={handleTelChange}
                        />
                    </Form.Item>
                    {contactName && <p>Name: {contactName}</p>}
                </Form>
            </Modal>




        </div>
    );
}

export default Cash;
