import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Modal } from "antd";

function DeleteProducts({ product, onDelete }) {
    const [modalDelete, setModalDelete] = useState(false);

    useEffect(() => {
        if (product) {
            setModalDelete(true);
        }
    }, [product]);

    const handleDelete = useCallback(async () => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${product.p_id}`);
            Modal.success({
                content: 'Your product has been deleted.',
            });
            onDelete(); // Call onDelete to update the product list
            setModalDelete(false);
        } catch (error) {
            console.log('Cannot delete product', error);
            Modal.error({
                content: 'There was a problem deleting the product.',
            });
        }
    }, [product, onDelete]);

    const handleCancel = () => {
        setModalDelete(false);
        onDelete()
    };

    return (
        <>
            <Modal
                title="Confirm Deletion"
                open={modalDelete}  // Use 'open' instead of 'visible'
                onOk={handleDelete}
                onCancel={handleCancel}
                okText="Yes, delete it!"
                cancelText="No, keep it"
            >
                <p>Are you sure you want to delete this product?</p>
                <p>ID: {product.p_id}</p>
                <p>Name: {product.p_name}</p>
                <p>Price: {product.p_price}</p>
                <p>Type: {product.p_type}</p>
                <p>Category: {product.category}</p>
            </Modal>
        </>
    );
}

export default DeleteProducts;
