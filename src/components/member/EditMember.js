import { Modal, Form, Input, InputNumber, Button, notification } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

function EditMember({ member, update }) {
    const [openEditModal, setOpenEditModal] = useState(false)
    const [updateMemberValue, setUpdateMemberValue] = useState()

    useEffect(() => {
        if (member) {
            console.log('editmember', member)
            setOpenEditModal(true)
            setUpdateMemberValue(member); 
        }
    }, [member])

 const onChangeValue = (key) => (e) => {
    const newValue = e.target.value;
    setUpdateMemberValue((prevValues) => ({
        ...prevValues,
        [key]: newValue,
    }));
    console.log(newValue);
}

    const updateMember = async () => {
        try {
            await axios.put(`http://localhost:5000/api/members/${updateMemberValue.c_id}`,
                updateMemberValue
            )
            notification.success({
                message: "Saved!",
                description: "Your Member has been Update.",
            });
            setOpenEditModal(false)
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
                title="Edit Members"
                open={openEditModal}
                style={{
                    textAlign: "center",
                    maxWidth: 450,
                }}
                onOk={() => {
                    updateMember()
                }}
                onCancel={() => {
                    setOpenEditModal(false);
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
                        c_fname: member.c_fname,
                        c_lname: member.c_lname,
                        c_tel: member.c_tel,
                    }}
                >
                    <Form.Item
                        label="First Name"
                        name='c_fname'
                    >
                        <Input onChange={onChangeValue('c_fname')} />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name='c_lname'
                    >
                        <Input onChange={onChangeValue('c_lname')} />
                    </Form.Item>
                    <Form.Item
                        label="TEl"
                        name='c_tel'
                    >
                        <Input style={{ width: '100%' }}
                            onChange={onChangeValue('c_tel')} />
                    </Form.Item>
                </Form>


            </Modal>
        </>
    )
}

export default EditMember