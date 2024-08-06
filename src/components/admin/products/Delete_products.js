import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

function DeleteProducts({ product, onDelete }) {
    const [modalDelete, setModalDelete] = useState(false);

    useEffect(() => {
        if (product) {
            setModalDelete(true);

        }
    }, [product]);

    const handleDelete = useCallback(async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `ID: ${product.p_id} Name: ${product.p_name} Price: ${product.p_price} Type: ${product.p_type} Category: ${product.category}  `,
            icon: "warning",
            width: 'auto',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#198754',
            cancelButtonColor: '#DC3545'
            // denyButtonText: 'No, keep it'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${product.p_id}`);
                Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
                onDelete(); // Call onDelete to update the product list
                setModalDelete(false);
            } catch (error) {
                console.log('Cannot delete product', error);
                Swal.fire('Error!', 'There was a problem deleting the product.', 'error');
            }
        }
    }, [product, onDelete])

    useEffect(() => {
        if (modalDelete) {
            handleDelete();
        } else {
            onDelete()
        }
    }, [modalDelete, onDelete, handleDelete]);

    return null;
}
export default DeleteProducts;
