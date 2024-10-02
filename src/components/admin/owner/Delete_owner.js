import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Modal, message } from 'antd';

function Delete_owner({ owner, onDelete }) {
    const [modalDelete, setModalDelete] = useState(false);

    useEffect(() => {
        if (owner) {
            setModalDelete(true);
        }
    }, [owner]);

    const handleDelete = useCallback(async () => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${owner.user_id}`);
            message.success('Deleted! Your owner has been deleted.'); // Show success message
            onDelete(); // Call onDelete to update the owner list
            setModalDelete(false);
        } catch (error) {
            console.log('Cannot delete owner', error);
            message.error('Error! There was a problem deleting the owner.'); // Show error message
        }
    }, [owner, onDelete]);

    const handleCancel = () => {
        setModalDelete(false); // Close the modal
    };

    const showDeleteConfirm = () => {
        Modal.confirm({
            title: 'Are you sure?',
            content: (
                <div>
                    <p>ID: {owner.user_id}</p>
                    <p>Name: {owner.user_fname} {owner.user_lname}</p>
                    <p>Tel: {owner.user_tel}</p>
                    <p>ID Card: {owner.user_id_card}</p>
                </div>
            ),
            okText: 'Yes, delete it!',
            okType: 'danger',
            cancelText: 'Cancel',
            centered:true,
            onOk: handleDelete, // Call handleDelete if confirmed
            onCancel: handleCancel, // Close modal if canceled
    });
    };

    useEffect(() => {
        if (modalDelete) {
            showDeleteConfirm(); // Show the delete confirmation modal
        } else {
            onDelete(); // Call onDelete if modal is closed without confirmation
        }
    }, [modalDelete, onDelete]);

    return null;
}

export default Delete_owner;
