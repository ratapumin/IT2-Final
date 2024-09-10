import { Modal, Form, Input, Button, Space } from 'antd';
import { useEffect } from 'react';

function CloseDaily({ CloseDaily, handleCloseDaily }) {

    useEffect(() => {
        console.log('Modal state:', CloseDaily);
    }, [CloseDaily]);

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
                        name="cash"
                    >
                        <Input readOnly />
                    </Form.Item>

                    <Form.Item
                        label="PROMPTPAY"
                        name="promtpay"
                        rules={[
                            { required: true, message: 'Please input PROMPTPAY!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <span
                        className="ant-form-text"
                        style={{ marginInlineStart: 8, padding: 15 }}
                    >
                        Total Cash In Machine
                    </span>

                    <Form.Item
                        label="Cash"
                        name="Cash"
                        rules={[{ required: true, message: 'Please input Cash!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>

                <Space>
                    <Button
                        key="select"
                        type="primary"
                        onClick={() => handleCloseDaily(false)} // ปิด modal เมื่อกด Ok
                    >
                        Ok
                    </Button>
                    <Button
                        key="search"
                        onClick={() => handleCloseDaily(false)} // ปิด modal เมื่อกด Cancel
                    >
                        Cancel
                    </Button>
                </Space>
            </Modal>
        </>
    );
}

export default CloseDaily;
