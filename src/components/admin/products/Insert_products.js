import axios from "axios"
import { useState } from "react"


function Insert_products() {

    //state products
    const [product, setProduct] = useState({
        p_id: '',
        p_name: '',
        p_price: '',
        p_type: '',
        category_id: ''
    })


    //add_products
    const handleChange = (e) => {
        const { name, value } = e.target
        setProduct((insert_product) => ({
            ...insert_product,
            [name]: value
        }))
    }

    //add to api
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:5000/api/products',
                product
            )
            console.log('page insert', res)
            setProduct({
                p_id: "",
                p_name: "",
                p_price: "",
                p_type: "",
                category_id: "",
            });
        } catch (error) {
            console.log('page insert error ', error)

        }
        console.log('api: ', product)


    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    Product Id
                    <input type="text" name="p_id" onChange={handleChange} />
                </label>
                <label>
                    Product Name
                    <input type="text" name="p_name" onChange={handleChange} />
                </label>
                <label>
                    Product Price
                    <input type="text" name="p_price" onChange={handleChange} />
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
                <label>
                    Category Id
                    <select name="category_id" id="category_id" defaultValue="" onChange={handleChange}>
                        <option value="" disabled>Select a category</option>
                        <option value="1">ICE</option>
                        <option value="2">HOT</option>
                    </select>
                </label>
                <button type="submit">Add Product</button>

            </form>
        </>
    )

}
export default Insert_products