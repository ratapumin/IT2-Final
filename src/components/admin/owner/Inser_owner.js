import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { Modal, Form, Input, Row, Col, message, notification, Button } from "antd";

function Insert_owner({ insertOwner, ownerList }) {
    const [ownerIdList, setOwnerIDList] = useState([]);
    const [newOwnerId, setNewOwnerId] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [form] = Form.useForm();

    useEffect(() => {
        if (ownerList) {
            const filteredOwners = ownerList.filter((owner) => owner.user_id);
            setOwnerIDList(filteredOwners);
        }


    }, [ownerList]);

    const generateRandomNumber = () => Math.floor(Math.random() * 90000) + 10000;

    const generateUniqueId = useCallback(() => {
        let newId;
        do {
            newId = generateRandomNumber();
        } while (ownerIdList.includes(newId));
        setNewOwnerId(newId);
    }, [ownerIdList]);

    useEffect(() => {
        if (ownerIdList) {
            generateUniqueId();
        }
    }, [generateUniqueId, ownerIdList]);

    useEffect(() => {
        if (newOwnerId) {
            form.setFieldsValue({ user_id: newOwnerId });
        }
    }, [newOwnerId, form]);

    const onFinish = async (values) => {
        // ตรวจสอบเบอร์โทรศัพท์
        if (!/^\d+$/.test(values.user_tel)) {
            notification.error({ message: 'Phone number must be numeric only!' });
            return;
        }
        if (values.user_tel.length !== 10) {
            notification.error({ message: 'Phone number must be exactly 10 digits!' });
            return;
        }

        // ตรวจสอบบัตรประชาชน
        if (!/^\d+$/.test(values.user_id_card)) {
            notification.error({ message: 'ID Card must be numeric only!' });
            return;
        }
        if (values.user_id_card.length !== 13) {
            notification.error({ message: 'ID Card must be exactly 13 digits!' });
            return;
        }

        // ตรวจสอบว่าเบอร์โทรศัพท์หรือบัตรประชาชนมีอยู่แล้วในระบบหรือไม่
        if (ownerIdList.find(owner => owner.user_tel === values.user_tel)) {
            notification.error({ message: "This phone number already exists." });
            return;
        }

        if (ownerIdList.find(owner => owner.user_id_card === values.user_id_card)) {
            notification.error({ message: "This ID Card already exists." });
            return;
        }

        // ตั้งค่าค่าเริ่มต้น
        values.user_id = newOwnerId;
        values.role_type = 'O';
        values.user_status = 'Active';
        console.log(values);

        // ส่งข้อมูลไปยังเซิร์ฟเวอร์
        if (values) {
            try {
                await axios.post(`http://localhost:5000/api/users`, values);
                message.success("Owner inserted successfully!");
                form.resetFields();
                setIsModalVisible(false);
                insertOwner(false);
            } catch (error) {
                console.error("Error inserting owner:", error);
                message.error("Failed to insert owner.");
            }
        }
    };




    const handleCancel = () => {
        setIsModalVisible(false);
        insertOwner(false);
    };

    return (
        <Modal
            title="Insert Owner"
            open={isModalVisible}
            // onOk={handleOk}
            centered
            footer={null}
            closable={false}
            style={{
                textAlign: "center",
                minWidth: 700,
            }}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ user_id: newOwnerId }}
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="User ID" name="user_id">
                            <Input value={newOwnerId} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Password" name="user_password"
                            rules={[{ required: true, message: "Please enter a password" },
                            { min: 5, max: 15, message: "Password must be 5-15 characters long" }]}>
                            <Input.Password />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="First Name" name="user_fname"
                            rules={[{ required: true, message: "Please enter a first name" },
                            { max: 30, message: "First name cannot exceed 30 characters" }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Last Name" name="user_lname"
                            rules={[{ required: true, message: "Please enter a last name" },
                            { max: 30, message: "Last name cannot exceed 30 characters" }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
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
                    </Col>
                    <Col span={12}>
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

                    </Col>

                </Row>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                <Button type="danger"
                    onClick={() => {
                        handleCancel(false)
                        form.resetFields()
                    }}>
                    Cancel
                </Button>
            </Form>
        </Modal>
    );
}

export default Insert_owner;
