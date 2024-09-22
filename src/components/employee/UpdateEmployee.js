import { Modal, Form, Input, InputNumber, Button, notification } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';



function UpdateEmployee({employee ,update}){


    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [updateEmployeeValue, setUpdateEmployeeValue] = useState()

    useEffect(() => {
        if (employee) {
            console.log('updateEmployeeValue', employee)
            setOpenUpdateModal(true)
            setUpdateEmployeeValue(employee); 
        }
    }, [employee])

 const onChangeValue = (key) => (e) => {
    const newValue = e.target.value;
    setUpdateEmployeeValue((prevValues) => ({
        ...prevValues,
        [key]: newValue,
    }));
    console.log(newValue);
}

    const updateMember = async () => {
        try {
            await axios.put(`http://localhost:5000/api/users/${updateEmployeeValue.user_id}`,
                updateEmployeeValue
            )
            notification.success({
                message: "Saved!",
                description: "Your Member has been Update.",
            });
            setOpenUpdateModal(false)
            update()
        } catch (error) {
            console.log("Cannot Insert Member", error);
            notification.error({
                message: "Error!",
                description: "There was a problem inserting the member.",
            });
        }
    }

    return (
        <>

            <Modal
                centered
                title="Edit Employee"
                open={openUpdateModal}
                style={{
                    textAlign: "center",
                    maxWidth: 450,
                }}
                onOk={() => {
                    updateMember()
                }}
                onCancel={() => {
                    setOpenUpdateModal(false);
                    update()
                }}
            //    footer={null} 
            >

                <Form
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    size='default'
                    style={{ maxWidth: 600 }}
                    initialValues={{
                        user_fname:employee.user_fname,
                        user_lname:employee.user_lname,
                        user_password:employee.user_password,
                        user_tel:employee.user_tel,
                        user_id_card:employee.user_id_card
                    }}
                >
                    <Form.Item
                        label="First Name"
                        name='user_fname'
                    >
                        <Input onChange={onChangeValue('user_fname')} />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name='user_lname'
                    >
                        <Input onChange={onChangeValue('user_lname')} />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name='user_password'
                    >
                        <Input style={{ width: '100%' }}
                            onChange={onChangeValue('user_password')} />
                    </Form.Item>
                    <Form.Item
                        label="TEl"
                        name='user_tel'
                    >
                        <Input style={{ width: '100%' }}
                            onChange={onChangeValue('user_tel')} />
                    </Form.Item>

                    <Form.Item
                        label="Id Card"
                        name='user_id_card'
                    >
                        <Input style={{ width: '100%' }}
                            onChange={onChangeValue('user_id_card')} />
                    </Form.Item>
                </Form>


            </Modal>
        </>
    )

}

export default UpdateEmployee