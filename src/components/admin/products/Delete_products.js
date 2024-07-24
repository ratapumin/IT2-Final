import swal from 'sweetalert';



function Delete_products({ product, handleDelete, onCancel }) {
    if (!product) return null;

    const handleConfirmDelete = async (e) => {
        e.preventDefault();

        // Show SweetAlert confirmation dialog
        const result = await swal({
            title: 'Are you sure?',
            text: `Do you want to delete the product ${product.p_name}?`,
            icon: 'warning',
            buttons: ['Cancel', 'Yes, delete it!'],
            dangerMode: true,
        });

        if (result) {
            // Call the delete handler if confirmed
            handleDelete(product.p_id);
        }
    };


    return (
        <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete the following product?</p>
            <label>Product ID
                <input
                    type="text"
                    name="p_id"
                    value={product.p_id}
                    readOnly
                />
            </label>
            <label>Product Name
                <input
                    type="text"
                    name="p_name"
                    value={product.p_name}
                    readOnly
                />
            </label>
            <label>Price
                <input
                    type="text"
                    name="p_price"
                    value={product.p_price}
                    readOnly
                />
            </label>
            <label>Product Type
                <input
                    type="text"
                    name="p_type"
                    value={product.p_type}
                    readOnly
                />
            </label>
            <label>Category
                <input
                    type="text"
                    name="category_id"
                    value={product.category_id}
                    readOnly
                />
            </label>
            <button type="button" onClick={handleConfirmDelete}>Delete</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </div>
    );
}

export default Delete_products;
