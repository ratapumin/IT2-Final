import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import { useState } from 'react';

function DeleteMember() {
    const [openDeleteModal, setOpenEditModal] = useState(false)
    const { confirm } = Modal;


    const showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure delete this task?',
            icon: <ExclamationCircleFilled />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    return (
        <>
            <Button
                className='btnAction'
                danger
                onClick={showDeleteConfirm}
            >
                Delete
            </Button>

        </>
    )
}

export default DeleteMember