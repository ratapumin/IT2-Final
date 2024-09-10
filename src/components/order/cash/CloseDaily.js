import { Modal, Form, Input, Button, Space } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

function CloseDaily({ CloseDaily, handleCloseDaily }) {
    const [totalcash, setTotalCash] = useState('');
    const [totalpromtpay, setTotalPromtpay] = useState('');
    const [cashInput, setCashInput] = useState('');

    useEffect(() => {
        const fetchTotalPrice = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/sales');
                console.log('price', res.data);

                // แยกค่าออกตาม payment_type
                const cashData = res.data.find(item => item.payment_type === 'cash') || { 'SUM(order_detail.price)': '' };
                const promtpayData = res.data.find(item => item.payment_type === 'promtpay') || { 'SUM(order_detail.price)': '' };

                // ตั้งค่า state
                setTotalCash(cashData['SUM(order_detail.price)'] || '');
                setTotalPromtpay(promtpayData['SUM(order_detail.price)'] || '');

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchTotalPrice();
    }, []);

    const handleCashChange = (e) => {
        setCashInput(e.target.value);
        console.log(cashInput)
    };

    const handleCheckTotal = () => {
        const onCash = parseFloat(cashInput)
        if (onCash != totalcash) {
            console.log('total Not equal')
        } else {
            console.log('total equal')

        }
    }


    return (
        <>
            <Modal
                title="Close Daily Sales"
                style={{
                    textAlign: "center",
                    maxWidth: 450,
                }}
                centered
                open={CloseDaily}
                footer={[]}
                cancelButtonProps={{ style: { display: 'none' } }}
                closable={false}
            >
                <Form
                    name="wrap"
                    labelCol={{
                        flex: '110px',
                    }}
                    labelAlign="left"
                    labelWrap
                    wrapperCol={{
                        flex: 1,
                    }}
                    colon={false}
                    style={{ paddingBlock: 32, margin: 0 }}
                >
                    <Form.Item
                        label="CASH"
                    >
                        <Input value={totalcash} disabled />
                    </Form.Item>

                    <Form.Item
                        label="PROMPTPAY"
                        rules={[
                            { required: true, message: 'Please input PROMPTPAY!' },
                        ]}
                    >
                        <Input value={totalpromtpay} disabled />
                    </Form.Item>

                    <span
                        className="ant-form-text"
                        style={{ marginInlineStart: 8, padding: 15 }}
                    >
                        Total Cash In Machine
                    </span>

                    <Form.Item
                        label="total"
                        rules={[{ required: true, message: 'Please input Cash!' }]}
                    >
                        <Input
                            type="number"
                            value={cashInput}
                            onChange={handleCashChange}
                        />
                    </Form.Item>
                </Form>

                <Space>
                    <Button
                        key="select"
                        type="primary"
                        onClick={() => handleCheckTotal()}

                    >
                        Ok
                    </Button>
                    <Button
                        key="search"
                        onClick={() => handleCloseDaily(false)}
                    >
                        Cancel
                    </Button>
                </Space>
            </Modal>
        </>
    );
}

export default CloseDaily;