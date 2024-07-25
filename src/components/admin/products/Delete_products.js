import { useEffect, useState } from "react";
import axios from "axios";

function Delete_products({ product, onDelete }) {
    const [products, setProducts] = useState([])
    const [item, setItem] = useState({})
    const [modalDelete, setModalDelete] = useState(false)



    useEffect(() => {
        if (product) {
            setItem(product)
            setModalDelete(true)
        }

    }, [product])

    const handleDelete = async (e) => {
        e.preventDefault()
        console.log('product id', item.p_id)
        try {
            await axios.delete(`http://localhost:5000/api/products/${item.p_id}`)
            const res = await axios.get('http://localhost:5000/api/products')
            console.log(res.data)
            setProducts(res.data)
            setItem({
                p_id: '',
                p_name: '',
                p_price: '',
                p_type: '',
                category_id: ''
            })
            setModalDelete(false)
        } catch (error) {
            console.log('Cannot delete product', error);

        }
    }


    return (
        <>
            {products.length > 0 && products.map(product => (
                <ul key={product.p_id}>
                    <li>Product Name: {product.p_name}</li>
                    <li>Price: {product.p_price}</li>
                    <li>productType: {product.p_type}</li>
                    <li>Category: {product.category_id}</li>
                    <button
                    // onClick={() => handleChange(product.p_id)}
                    >delete</button>
                </ul>
            ))}

            {modalDelete && (
                <form onSubmit={handleDelete}>
                    <label>Product ID
                        <input
                            type="text"
                            name="p_id"
                            value={item.p_id}
                            // onChange={handleChange}
                            readOnly />
                    </label>
                    <label>Product Name
                        <input
                            type="text"
                            name="p_name"
                            value={item.p_name}
                        // onChange={handleChange}
                        />
                    </label>
                    <label>Price
                        <input
                            type="text"
                            name="p_price"
                            value={item.p_price}
                        // onChange={handleChange}
                        />
                    </label>
                    <label>Product Type
                        <input
                            type="text"
                            name="p_type"
                            value={item.p_type}
                        // onChange={handleChange}
                        />
                    </label>
                    <label>
                        Product Type
                        <select name="p_type" id="p_type" defaultValue=""
                        //  onChange={handleChange}
                        >
                            <option value="" disabled>Select a type</option>
                            <option value="Coffee">Coffee</option>
                            <option value="Tea">Tea</option>
                            <option value="Chocolate">Chocolate</option>
                            <option value="Another">Another</option>
                        </select>
                    </label>
                    <label>Category
                        <input
                            type="text"
                            name="category_id"
                            value={item.category_id}
                        // onChange={handleChange}
                        />
                    </label>
                    <button type="sumbit">Delete</button>
                </form>
            )}
        </>
    )





}
export default Delete_products