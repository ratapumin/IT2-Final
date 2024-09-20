import {
    Modal, Form,
    Input,
    InputNumber,
    Button
} from 'antd';
import { useState } from 'react';

function EditMember() {
    const [openEditModal, setOpenEditModal] = useState(false)

    return (
        <>
            <Button
             className='btnAction'
             type="primary" ghost
             onClick={()=>{
                setOpenEditModal(true)
             }}
             >
                EDIT
            </Button>
            <Modal
                centered
                title="Edit Members"
                open={openEditModal}
                style={{
                    textAlign: "center",
                    maxWidth: 450,
                }}
                //  onOk={handleOk} 
                onCancel={() => {
                    setOpenEditModal(false)
                }}
            //    footer={null} 
            >

                <Form
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    size='default'
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item label="First Name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Last Name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="TEl">
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Form>


            </Modal>
        </>
    )
}

export default EditMember