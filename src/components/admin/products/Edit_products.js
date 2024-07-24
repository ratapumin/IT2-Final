import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Edit_products({ product, saveEdit }) {
    const [currentProduct, setCurrentProduct] = useState(product);



    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct((changeProduct) => ({
            ...changeProduct,
            [name]: value,
        }));
    };

    // Send new value to API
    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:5000/api/products/${currentProduct.p_id}`,
                currentProduct
            );
            saveEdit()
        } catch (error) {
            console.log("Cannot edit product", error);
        }
    };

    return (
        <>
            <Form onSubmit={handleEdit} className="p-4 bg-light border rounded">
                <Form.Group>
                    <Form.Label>Product ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="p_id"
                        value={currentProduct.p_id}
                        onChange={handleChange}
                        readOnly
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="p_name"
                        value={currentProduct.p_name}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="text"
                        name="p_price"
                        value={currentProduct.p_price}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Product Type</Form.Label>
                    <Form.Control
                        as="select"
                        name="p_type"
                        value={currentProduct.p_type}
                        onChange={handleChange}
                    >
                        <option value="" disabled>
                            Select a type
                        </option>
                        <option value="Coffee">Coffee</option>
                        <option value="Tea">Tea</option>
                        <option value="Chocolate">Chocolate</option>
                        <option value="Another">Another</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                        type="text"
                        name="category_id"
                        value={currentProduct.category_id}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Change
                </Button>
                <Button
                    variant="secondary"
                    className="ml-2"
                    onClick={saveEdit}
                >
                    Cancel
                </Button>
            </Form>
        </>
    );
}

export default Edit_products;
