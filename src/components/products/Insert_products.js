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
    const handdleChange = (e) => {
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
                    <input type="text" name="p_id" onChange={handdleChange} />
                </label>
                <label>
                    Product Name
                    <input type="text" name="p_name" onChange={handdleChange} />
                </label>
                <label>
                    Product Price
                    <input type="text" name="p_price" onChange={handdleChange} />
                </label>
                <label>
                    Product Type
                    <select name="p_type" id="p_type" defaultValue="" onChange={handdleChange}>
                        <option value="" disabled>Select a type</option>
                        <option value="coffee">Coffee</option>
                        <option value="tea">Tea</option>
                        <option value="chocolate">Chocolate</option>
                        <option value="another">Another</option>
                    </select>
                </label>
                <label>
                    Category Id
                    <select name="category_id" id="category_id" defaultValue="" onChange={handdleChange}>
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