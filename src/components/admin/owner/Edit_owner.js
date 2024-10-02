import axios from "axios";
import { useEffect, useState } from "react";
import { Modal, Form, Input, Row, Col, message, notification, Select } from "antd";

function Edit_owner({ owner, saveEdit, ownerList }) {
    const [currentOwner, setCurrentOwner] = useState(owner);
    const [isModalVisible, setIsModalVisible] = useState(true);
    const [form] = Form.useForm();

    useEffect(() => {
        setCurrentOwner(owner);
        form.setFieldsValue(owner);
    }, [owner, form]);

    const onFinish = async (values) => {
        // ตรวจสอบเบอร์โทรศัพท์
        if (!/^\d+$/.test(values.user_tel)) {
            message.error('Phone number must be numeric only!');
            return;
        }
        if (values.user_tel.length !== 10) {
            message.error('Phone number must be exactly 10 digits!');
            return;
        }

        // ตรวจสอบบัตรประชาชน
        if (!/^\d+$/.test(values.user_id_card)) {
            message.error('ID Card must be numeric only!');
            return;
        }
        if (values.user_id_card.length !== 13) {
            message.error('ID Card must be exactly 13 digits!');
            return;
        }

        if (ownerList.find(owner => owner.user_tel === values.user_tel && owner.user_id !== values.user_id)) {
            notification.error({ message: "This phone number already exists." });
            return;
        }
        if (ownerList.find(owner => owner.user_id_card === values.user_id_card && owner.user_id !== values.user_id)) {
            notification.error({ message: "This ID Card already exists." });
            return;
        }
        
        // ส่งข้อมูลไปยังเซิร์ฟเวอร์
        try {
            await axios.put(`http://localhost:5000/api/users/${values.user_id}`, values);
            message.success("Owner updated successfully!");
            setIsModalVisible(false);
            saveEdit(); // เรียก callback เมื่อบันทึกสำเร็จ
        } catch (error) {
            console.error("Cannot edit owner", error);
            message.error("Failed to update owner.");
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        saveEdit();
    };

    return (
        <Modal
            title="Edit Owner"
            open={isModalVisible}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            centered
            width={700}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={currentOwner}
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="User ID" name="user_id">
                            <Input value={currentOwner?.user_id} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Password" name="user_password"
                            rules={[{ required: true, message: "Please enter a password" },
                            { min: 5, max: 15, message: "Password must be 5-15 characters long" }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="First Name" name="user_fname"
                            rules={[{ required: true, message: "Please enter a first name" },
                            { max: 30, message: "First name cannot exceed 30 characters" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Last Name" name="user_lname"
                            rules={[{ required: true, message: "Please enter a last name" },
                            { max: 30, message: "Last name cannot exceed 30 characters" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Tel" name="user_tel"
                            rules={[{ required: true, message: "Please input your phone number!" }]}
                        >
                            <Input
                                maxLength={10}
                                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} // กรองเฉพาะตัวเลข
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="ID Card" name="user_id_card"
                            rules={[{ required: true, message: "Please input your ID Card!" }]}
                        >
                            <Input
                                maxLength={13}
                                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} // กรองเฉพาะตัวเลข
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Role" name="role_type">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Status" name="user_status">
                            <Select>
                                <Select.Option value="Active">Active</Select.Option>
                                <Select.Option value="Unactive">Unactive</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

export default Edit_owner;
