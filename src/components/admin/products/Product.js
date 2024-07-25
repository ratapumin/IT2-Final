import axios from "axios";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import EditProduct from './Edit_products'
import DeleteProducts from "./Delete_products";

function Product() {
    const [products, setProducts] = useState([]);
    const [editProductId, setEditProductId] = useState(null);
    const [deleteProductId, setDeleteProductId] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/products");
            setProducts(res.data);
        } catch (error) {
            console.log("Cannot fetch products", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSaveEdit = async () => {
        // console.log(products.p_id)
        await fetchProducts();
        setEditProductId(null);
    };

    const handleonDelete = async () => {
        // console.log(products.p_id)
        await fetchProducts();
        setDeleteProductId(null);
    };

    return (
        <>
            <p>product page</p>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={product.p_id}>
                            <td>{index + 1}</td>
                            <td>{product.p_id}</td>
                            <td>{product.p_name}</td>
                            <td>{product.p_price}</td>
                            <td>{product.p_type}</td>
                            <td>{product.category_id}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    onClick={() => setEditProductId(product.p_id)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => setDeleteProductId(product.p_id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))} 
                </tbody>
            </Table>

            {editProductId && (
                <EditProduct
                    product={products.find((p) => p.p_id === editProductId)}
                    saveEdit={handleSaveEdit}
                />
            )}

            {deleteProductId && (
                <DeleteProducts
                    product={products.find((p) => p.p_id === deleteProductId)}
                    onDelete={handleonDelete}
                />
            )}
        </>
    );
}

export default Product;
