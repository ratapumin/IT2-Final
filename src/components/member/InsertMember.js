import { useEffect, useState } from "react"
import { Modal, Form, Input, InputNumber, Button, notification } from 'antd';
import axios from "axios";


function InsertMember({ refreshMembers }) {
    const [openModalInsert, setOpeModalInsert] = useState(false)
    const [form] = Form.useForm()

    const onFinish = async (values) => {

        if (!/^\d+$/.test(values.c_tel) || values.c_tel.length !== 10) {
            notification.error({ message: 'Phone number must be 10 digits and numeric only!' });
            return;
        }

        values.c_points = 0;  // เพิ่มค่าในรูปแบบของ key-value
        values.c_status = 'Active';
        console.log('Success:', values);
        // setMemberValues(values)
        if (values) {
            try {
                await axios.post(`http://localhost:5000/api/members`, values)
                notification.success({
                    message: "Saved!",
                    description: "Your Member has been Insert.",
                });
                form.resetFields()
                setOpeModalInsert(false)
                refreshMembers()

            } catch (error) {
                console.log("Cannot Insert Member", error);
                notification.error({
                    message: "Error!",
                    description: "There was a problem inserting the member.",
                });
            }

        }
    };



    return (
        <>
            <Button className='btnAddCus'
                onClick={() => {
                    setOpeModalInsert(true)
                }}
            >
                ADD MEMBER
            </Button>

            <Modal
                centered
                title="Insert Members"
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
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    size='default'
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="First Name"
                        name='c_fname'  // ชื่อ key ที่จะอยู่ใน values
                        rules={[{ required: true, message: 'Please input your First Name!' }]}  // validation
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='c_lname'
                        label="Last Name"
                        rules={[{ required: true, message: 'Please input your Last Name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name='c_tel'
                        label="TEL"
                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                        <Input style={{ width: '100%' }} minLength={10} maxLength={10}
                            onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                        />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button type="danger"
                        onClick={() => {
                            setOpeModalInsert(false)
                        }}>
                        Cancel
                    </Button>
                </Form>
            </Modal>
        </>
    )
}

export default InsertMember