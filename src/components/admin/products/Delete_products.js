import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

function DeleteProducts({ product, onDelete }) {
    const [modalDelete, setModalDelete] = useState(false);

    useEffect(() => {
        if (product) {
            setModalDelete(true);

        }
    }, [product]);

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `ID: ${product.p_id} Name: ${product.p_name} Price: ${product.p_price} Type: ${product.p_type} Category: ${product.category_id}  `,
            icon: "warning",
            width:'600',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            denyButtonText: 'No, keep it'
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
        } else if (result.isDenied) {
            Swal.fire('Product is safe!', '', 'info');
        }
    };

    useEffect(() => {
        if (modalDelete) {
            handleDelete();
        } else {
            onDelete()
        }
    }, [modalDelete]);

    return null;
}
export default DeleteProducts;
