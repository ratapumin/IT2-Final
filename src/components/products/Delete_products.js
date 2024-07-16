import { useEffect, useState } from "react";
import axios from "axios";

function Delete_products() {
    const [products, setProducts] = useState([])
    const [item, setItem] = useState({})
    const [modalDelete, setModalDelete] = useState(false)
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products')
                setProducts(res.data)
            } catch (error) {
                console.log('can fetch products', error)

            }
        }
        fetchProduct()
    }, [])

    const handleFindID = (id) => {
        const findproduct = products.find(product => product.p_id === id)
        console.log(findproduct)
        setItem(findproduct)
        setModalDelete(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setItem((delete_item) => ({
            ...delete_item,
            [name]: value

        }))
        console.log('setasd', item)

    }


    const handleDelete = async (e) => {
        e.preventDefault();
        console.log('iem', item)

        try {
            console.log('initem', item)
            await axios.delete(`http://localhost:5000/api/products/${item.p_id}`);
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
            setItem({
                p_id: '',
                p_name: '',
                p_price: '',
                p_type: '',
                category_id: ''
            });
            setModalDelete(false);
        } catch (error) {
            console.log('Cannot delete product', error);
        }
    }


    const handleCancel = () => {
        setModalDelete(false)
    }

    return (
        <>
            {products.length > 0 && products.map(product => (
                <ul key={product.p_id}>
                    <li>Product Name: {product.p_name}</li>
                    <li>Price: {product.p_price}</li>
                    <li>productType: {product.p_type}</li>
                    <li>Category: {product.category_id}</li>
                    <button onClick={() => handleFindID(product.p_id)}>delete</button>
                </ul>
            ))}

            {modalDelete && (
                <form onSubmit={handleDelete}>
                    <label>Product ID
                        <input
                            type="text"
                            name="p_id"
                            value={item.p_id}
                            onChange={handleChange}
                            readOnly />
                    </label>
                    <label>Product Name
                        <input
                            type="text"
                            name="p_name"
                            value={item.p_name}
                            onChange={handleChange}
                        />
                    </label>
                    <label>Price
                        <input
                            type="text"
                            name="p_price"
                            value={item.p_price}
                            onChange={handleChange}
                        />
                    </label>
                    <label>Product Type
                        <input
                            type="text"
                            name="p_type"
                            value={item.p_type}
                            onChange={handleChange}
                        />
                    </label>
                    <label>Category
                        <input
                            type="text"
                            name="category_id"
                            value={item.category_id}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit">Delete</button>
                    <button onClick={handleCancel}> Cancel</button>
                </form>
            )}
        </>
    )





}
export default Delete_products