import { useEffect, useState, useCallback } from "react"
import { Modal, Form, Input, InputNumber, Button, notification } from 'antd';
import axios from "axios";



function InsertEmployee({ refreshEmployee, userList }) {
    const [openModalInsert, setOpeModalInsert] = useState(false)
    const [form] = Form.useForm()
    const [newEmployeeId, setNewEmployeeId] = useState("");


    function generateRandomNumber() {
        return Math.floor(Math.random() * 90000) + 10000;
    }

    const generateUniqueId = useCallback(() => {
        let newId;
        do {
            newId = generateRandomNumber();
        } while (userList.includes(newId));
        setNewEmployeeId(newId);
    }, [userList]);

    useEffect(() => {
        if (userList) {
            generateUniqueId();
        }
    }, [generateUniqueId, userList]);

    const onFinish = async (values) => {
        // ตรวจสอบว่าเป็นตัวเลขเท่านั้น
        if (!/^\d+$/.test(values.user_tel) || values.user_tel.length !== 10) {
            notification.error({ message: 'Phone number must be 10 digits and numeric only!' });
            return;
        }

        if (!/^\d+$/.test(values.user_id_card) || values.user_id_card.length !== 13) {
            notification.error({ message: 'ID Card must be 13 digits and numeric only!' });
            return;
        }

        if (userList.find(user => user.user_tel === values.user_tel && user.user_id !== values.user_id)) {
            notification.error({
                message: "This phone number already exists."
            });
            return;
        }

        if (userList.find(user => user.user_id_card === values.user_id_card && user.user_id !== values.user_id)) {
            notification.error({
                message: "This ID Card already exists."
            });
            return;
        }

        values.user_id = newEmployeeId
        values.role_type = 'E';
        values.user_status = 'Active';
        console.log('Success:', values);
        // console.log(newEmployeeId)

        if (values) {
            try {
                await axios.post(`http://localhost:5000/api/users`, values)
                notification.success({
                    message: "Saved!",
                    description: "Your Employee has been Insert."
                })
                form.resetFields()
                setOpeModalInsert(false)
                refreshEmployee()
            } catch (error) {
                console.log("Cannot Insert Member", error);
                notification.error({
                    message: "Error!",
                    description: "There was a problem inserting the Employee.",
                });
            }
        }
    }

    return (
        <>
            <Button className='btnAdd'
                style={{ marginRight: 8 }}
                onClick={() => {
                    setOpeModalInsert(true)
                }}
            >
                ADD EMPLOYEE
            </Button>



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
                        label="Tel"
                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                        <Input
                            maxLength={10}
                            style={{ width: '100%' }}
                            type="text"
                            onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} // กรองตัวอักษรที่ไม่ใช่ตัวเลข
                        />
                    </Form.Item>

                    <Form.Item
                        name='user_id_card'
                        label="ID Card"
                        rules={[{ required: true, message: 'Please input your ID Card!' }]}
                    >
                        <Input
                            maxLength={13}
                            style={{ width: '100%' }}
                            type="text"
                            onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} // กรองตัวอักษรที่ไม่ใช่ตัวเลข
                        />
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