import { useEffect, useState } from 'react';
import './Cash.css';
import Cashmoney from './Cashmoney';
import { Modal, Form, Input, Button } from 'antd';
import './Payment.css';
import axios from 'axios';

function Cash({ onCashChange, products, sumCash, onChange, onDeleteAll, selectedType, OnsaveMember }) {
    const [points, setPoints] = useState(false);
    const [collect, setCollect] = useState(false);
    const [tel, setTel] = useState('');
    const [contactName, setContactName] = useState('');
    const [members, setMembers] = useState([])
    const [currentMember, setCurrentMember] = useState()



    const contacts = [
        { phone: '1234567890', name: 'Alice' },
        { phone: '0987654321', name: 'Bob' },
        { phone: '5555555555', name: 'Charlie' },
    ];

    const fetchMembers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/members')
            console.log(res.data)
            setMembers(res.data)
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchMembers()
    }, [])

    const handleTelChange = (e) => {
        setTel(e.target.value);
    };

    const handleSearch = () => {
        // ค้นหาชื่อจากเบอร์โทร
        const member = members.find(member => member.c_tel === tel);
        setCurrentMember(member)
        setContactName(member ? `${member.c_fname}  ${member.c_lname} Points: ${member.c_points}` : 'ไม่พบข้อมูล');
        console.log('findmember', member)
        // ยังคงเปิด modal ไว้
    };

    const handleSelectMember = () => {
        // ค้นหาชื่อจากเบอร์โทร
        const member = members.find(member => member.c_tel === tel);
        setCurrentMember(member)
        // setContactName(member ? `${member.c_fname}  ${member.c_lname} Points: ${member.c_points}` : 'ไม่พบข้อมูล');
        console.log('findmember', member)
        OnsaveMember(member)
        setCollect(false)
    };






    const handleCollect = () => {
        setCollect(false);
        setTel(''); // ล้างค่า tel
        setContactName(''); // ล้างชื่อที่แสดง
    };

    return (
        <div className="flexCash">
            <button
                className="btnClick"
                onClick={() => setPoints(true)}
            >POINTS</button>
            <Cashmoney
                onCashChange={onCashChange}
                products={products}
                sumCash={sumCash}
                onChange={onChange}
                onDeleteAll={onDeleteAll}
                selectedType={selectedType}
                sentMember={currentMember}
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
                <button className='btnRedeem'>
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
                    <Button key="select" type="primary" onClick={handleSelectMember}>
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
        </div>
    );
}

export default Cash;
