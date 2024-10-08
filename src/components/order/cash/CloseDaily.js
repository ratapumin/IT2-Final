import { Modal, Form, Input, Button, Space, Empty, notification } from 'antd'; // นำเข้า notification
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useUser } from '../../user/UserContext';

function CloseDaily({ CloseDaily, handleCloseDaily }) {
    const [totalcash, setTotalCash] = useState('');
    const [cashInput, setCashInput] = useState('');
    const { user } = useUser();

    useEffect(() => {
        const fetchTotalPrice = async () => {
            try {
                const currentDate = moment().format('YYYY-MM-DD');
                const res = await axios.get(`http://localhost:5000/api/typesales/${currentDate}`);

                // แยกค่าออกตาม payment_type
                const cashData = res.data.find(item => item.payment_type === 'cash') || {};
                setTotalCash(cashData.total || 0);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchTotalPrice();
    }, []);

    const postCloseDaily = async () => {
        try {
            // const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            const currentDate = moment().format('YYYY-MM-DD'); // แปลงเป็นวันที่
            const res = await axios.post('http://localhost:5000/api/closedaily', {
                cash_in_machine: cashInput,
                date: currentDate,
                user_id: user.user_id
            });
            setCashInput('')
            console.log(res.data);
            printReceiptDaily(currentDate) // ส่งเฉพาะวันที่
            notification.success({
                message: 'Success',
                description: 'Close daily sales recorded successfully!',
            });
            handleCloseDaily(false); // ปิด modal
        } catch (error) {
            console.error('Error inserting closedaily:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to record close daily sales.',
            });
        }
    };
    

    const printReceiptDaily = async(dateTime)=>{
        try {
            const res = await axios.post(`http://localhost:5000/api/printdaily/${dateTime}`)
            console.log(res.data);
            notification.success({
                message: 'Success',
                description: 'Print receipt Close Daily successfully!',
            });
        } catch (error) {
            console.error('Error print closedaily:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to print receipt close daily sales.',
            });
        }
    }


    const handleCashChange = (e) => {
        setCashInput(e.target.value);
    };

    const handleCheckTotal = () => {
        const onCash = parseFloat(cashInput);
        if (onCash !== parseFloat(totalcash)) {
            postCloseDaily();
        } else {
            notification.warning({
                message: 'Warning',
                description: 'Total cash does not match!',
            });
            handleCloseDaily(false); // ปิด modal หากค่าตรงกัน
        }
    };

    return (
        <>
            {(totalcash && totalcash !== 0) ? (
                <Modal
                    title="Close Daily Sales"
                    style={{ textAlign: "center", maxWidth: 450 }}
                    centered
                    open={CloseDaily}
                    footer={[]}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    closable={false}
                >
                    <Form
                        name="wrap"
                        labelCol={{ flex: '110px' }}
                        labelAlign="left"
                        labelWrap
                        wrapperCol={{ flex: 1 }}
                        colon={false}
                        style={{ paddingBlock: 20, margin: 0 }}
                    >
                        <span className="ant-form-text" style={{ marginInlineStart: 8, padding: 15 }}>
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
                        <Button key="ok" type="primary" onClick={handleCheckTotal}>
                            Ok
                        </Button>
                        <Button key="close" onClick={() => handleCloseDaily(false)}>
                            Cancel
                        </Button>
                    </Space>
                </Modal>
            ) : (
                <Modal
                    title="No Data"
                    style={{ textAlign: "center", maxWidth: 450 }}
                    centered
                    open={CloseDaily}
                    onOk={() => handleCloseDaily(false)}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    closable={false}
                >
                    <Empty />
                </Modal>
            )}
        </>
    );
}

export default CloseDaily;
