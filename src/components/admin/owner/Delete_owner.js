import axios from "axios"
import { useEffect, useState, useCallback } from "react"
import Swal from 'sweetalert2';
function Delete_owner({ owner, onDelete }) {
    const [modalDelete, setModalDelete] = useState(false)

    useEffect(() => {
        if (owner) {
            setModalDelete(true);
        }
    }, [owner]);
    console.log(owner)

    const handleDelete = useCallback(async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `
                ID: ${owner.user_id}
                Name: ${owner.user_fname}   ${owner.user_lname} 
                Tel: ${owner.user_tel}
                ID Card: ${owner.user_id_card}  `,
            icon: "warning",
            width: "auto",
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#198754',
            cancelButtonColor: '#DC3545'
            // denyButtonText: 'No, keep it'
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${owner.user_id}`);
                Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
                onDelete(); // Call onDelete to update the product list
                setModalDelete(false);
            } catch (error) {
                console.log('Cannot delete product', error);
                Swal.fire('Error!', 'There was a problem deleting the product.', 'error');
            }
        }
    }, [owner, onDelete])

    useEffect(() => {
        if (modalDelete) {
            handleDelete();
        } else {
            onDelete()
        }
    }, [modalDelete,onDelete,handleDelete]);
    return null

}

export default Delete_owner