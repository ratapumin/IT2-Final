import { useEffect, useState } from "react"
import { Modal, Form, Input, InputNumber, Button, notification } from 'antd';
import axios from "axios";



function InsertEmployee() {
    const [openModalInsert, setOpeModalInsert] = useState(false)
    const [form] = Form.useForm()
    const onFinish = async (values) => {
        values.role_type = 'E'
        values.user_status = 'Active';
        console.log('Success:', values);
    }
    return (
        <>
            <button className='btnAdd'
                onClick={() => {
                    setOpeModalInsert(true)
                }}
            >
                ADD EMPLOYEE
            </button>



            <Modal
                centered
                title="Insert Employee"
                open={openModalInsert}
                style={{
                    textAlign: "center",
                    maxWidth: 450,
                }}
                footer={null}
                closable={false}
            >
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    layout="horizontal"
                    size='default'
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="First Name"
                        name='user_fname'  // ชื่อ key ที่จะอยู่ใน values
                        rules={[{ required: true, message: 'Please input your First Name!' }]}  // validation
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='user_lname'
                        label="Last Name"
                        rules={[{ required: true, message: 'Please input your Last Name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='user_password'
                        label="Pasword"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name='user_tel'
                        label="TEL"
                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                        <Input style={{ width: '100%' }}
                            type="number"
                            minLength={10} maxLength={10} />
                    </Form.Item>

                    <Form.Item
                        name='user_id_card'
                        label="ID Card"
                        rules={[{ required: true, message: 'Please input your Id Card!' }]}
                    >
                        <Input style={{ width: '100%' }}
                            type="number"
                            minLength={13} maxLength={13} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button type="danger"
                        onClick={() => {
                            setOpeModalInsert(false)
                            form.resetFields()
                        }}>
                        Cancel
                    </Button>
                </Form>
            </Modal>
        </>
    )
}

export default InsertEmployee