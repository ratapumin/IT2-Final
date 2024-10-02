import { Modal, Form, Input, Button, Space, Empty } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';

function CloseDaily({ CloseDaily, handleCloseDaily }) {
    const [totalcash, setTotalCash] = useState('');
    // const [totalpromtpay, setTotalPromtpay] = useState('');
    const [cashInput, setCashInput] = useState('');

    useEffect(() => {
        const fetchTotalPrice = async () => {
            try {
                const currentDate = moment().format('YYYY-MM-DD');
                console.log(currentDate);
                const res = await axios.get(`http://localhost:5000/api/typesales/${currentDate}`);
                console.log('price', res.data);

                // แยกค่าออกตาม payment_type
                const cashData = res.data.find(item => item.payment_type === 'cash') || {};
                // const promtpayData = res.data.find(item => item.payment_type === 'promtpay') || {};

                // ตั้งค่า state โดยถ้าไม่มีค่าให้ตั้งเป็น 0
                setTotalCash(cashData.total || 0);
                // setTotalPromtpay(promtpayData.total || 0);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchTotalPrice();
    }, []);

    const handleCashChange = (e) => {
        setCashInput(e.target.value);
        console.log(cashInput);
    };

    const handleCheckTotal = () => {
        const onCash = parseFloat(cashInput);
        if (onCash !== parseFloat(totalcash)) {
            console.log('total Not equal');
        } else {
            console.log('total equal');
        }
    };

    return (
        <>
            {(totalcash && totalcash !== 0)
                // && 
                //  (totalpromtpay !== null && totalpromtpay !== '' && totalpromtpay !== 0)
                ? (
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
                            style={{ paddingBlock: 20, margin: 0 }}
                        >
                            <span
                                className="ant-form-text"
                                style={{ marginInlineStart: 8, padding: 15 }}
                            >
                                Total Cash In Machine
                            </span>

                            <Form.Item
                                label="Total"
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
                )
                : (
                    <Modal
                        title="No Data"
                        style={{
                            textAlign: "center",
                            maxWidth: 450,
                        }}
                        centered
                        open={CloseDaily}
                        onOk={() => handleCloseDaily(false)}
                        cancelButtonProps={{ style: { display: 'none' } }}
                        closable={false}
                    >
                        <Empty />
                    </Modal>
                )
            }
        </>
    );


}

export default CloseDaily;
