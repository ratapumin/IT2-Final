import { Modal, Form, Input, Button } from 'antd';
import { useState } from 'react';



function CloseDaily() {

    const [isModalClose, setIsModalClose] = useState(false)

    const tel = 20

    return (
        <>
            <Button
                type="primary"
                onClick={() => {
                    setIsModalClose(true)

                }}
            >Primary Button</Button>
            <Modal
                title="Close Dailly Sales"
                style={{ textAlign: "center" }}
                centered
                open={isModalClose}
                // onOk={handleSearch}
                footer={[
                    <Button
                        key="search"
                    // onClick={handleSearch}
                    >
                        Search
                    </Button>,
                    <Button
                        key="select" type="primary"
                    //  onClick={handleSelectMemberRedeem}
                    >
                        Submit
                    </Button>
                ]}
                // onCancel={() => handleRedeem()}
                cancelButtonProps={{ style: { display: 'none' } }}
            // closable={false}
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
                    style={{
                        maxWidth: 600,
                    }}
                >
                    <Form.Item
                        label="CASH"
                        name="cash"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="PROMTPAY"
                        name="password"
                        rules={[
                            {
                                required: true, message: 'eie'
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

        </>
    )

}
export default CloseDaily