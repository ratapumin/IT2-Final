import axios from "axios"
import { useEffect, useState } from "react"

function Update_products() {
    const [products, setProducts] = useState([])
    const [currentproduct, setCurrentproduct] = useState({
        p_id: '',
        p_name: '',
        p_price: '',
        p_type: '',
        category_id: ''
    })

    const [modalEdit, setModelEdit] = useState(false)
    //fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products')
                // const productLists = res.data
                setProducts(res.data)
            } catch (error) {
                console.log('can fetch products', error)

            }
        }
        fetchProducts()
    }, [])

    //select product id
    const handleFindID = (id) => {
        // const findproduct = products.find(products => products.pid === id)
        const findproduct = products.find(product => product.p_id === id)
        console.log(findproduct)
        setCurrentproduct(findproduct)
        setModelEdit(true)
    }

    //sent new value
    const handleChange = (e) => {
        const { name, value } = e.target
        setCurrentproduct((edit_product) => ({
            ...edit_product,
            [name]: value
        }))
    }

    //sent new value to api
    const handleEdit = async (e) => {
        e.preventDefault()
        console.log('currten: ',currentproduct)
        try {
            await axios.put(`http://localhost:5000/api/products/${currentproduct.p_id}`, currentproduct)
            const res = await axios.get('http://localhost:5000/api/products')
            console.log(res.data)
            setProducts(res.data)
            setCurrentproduct({
                p_id: '',
                p_name: '',
                p_price: '',
                p_type: '',
                category_id: ''
            })
            setModelEdit(false)
        } catch (error) {
            console.log('Cannot edit product', error);
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
                    <button onClick={() => handleFindID(product.p_id)}>Edit</button>
                </ul>

            ))}

            {modalEdit && (
                <form onSubmit={handleEdit}>
                    <label>Product ID
                        <input
                            type="text"
                            name="p_id"
                            value={currentproduct.p_id}
                            onChange={handleChange}
                            readOnly />
                    </label>
                    <label>Product Name
                        <input
                            type="text"
                            name="p_name"
                            value={currentproduct.p_name}
                            onChange={handleChange}
                        />
                    </label>
                    <label>Price
                        <input
                            type="text"
                            name="p_price"
                            value={currentproduct.p_price}
                            onChange={handleChange}
                        />
                    </label>
                    <label>Product Type
                        <input
                            type="text"
                            name="p_type"
                            value={currentproduct.p_type}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                    Product Type
                    <select name="p_type" id="p_type" defaultValue="" onChange={handleChange}>
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
                            value={currentproduct.category_id}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="sumbit">Change</button>
                </form>
            )}
        </>
    )


}

export default Update_products