import { useState } from "react"
import {
    Modal, Form,
    Input,
    InputNumber,
} from 'antd';


function InsertMember() {

    const [openModalInsert, setOpeModalInsert] = useState(false)



    return (
        <>
            <button className='btnAdd'
                onClick={() => {
                    setOpeModalInsert(true)
                }}
            >
                ADD MEMBER
            </button>


            <Modal
                centered
                title="Insert Members"
                open={openModalInsert}
                style={{
                    textAlign: "center",
                    maxWidth: 450,
                }}
                //  onOk={handleOk} 
                onCancel={() => {
                    setOpeModalInsert(false)
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

export default InsertMember