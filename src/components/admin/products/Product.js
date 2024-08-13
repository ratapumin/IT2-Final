import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../user/UserContext";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import EditProduct from './Edit_products';
import DeleteProducts from "./Delete_products";
import InsertProduct from './Insert_products'
import './product.css'

function Product() {
    const [products, setProducts] = useState([]);
    const [editProductId, setEditProductId] = useState(null);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [insertOwner, setInsertOwner] = useState(false);
    const navigate = useNavigate();
    const { user } = useUser()

    useEffect(() => {
        if (!user || user.role === 'A') {
            navigate('/protected');
        }
    }, [user, navigate]);
    
    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/products");
            setProducts(res.data);
            console.log(res.data)
        } catch (error) {
            console.log("Cannot fetch products", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSaveEdit = async () => {
        await fetchProducts();
        setEditProductId(null);
    };

    const handleonDelete = async () => {
        // console.log(deleteProductId)
        await fetchProducts();
        setDeleteProductId(null);
    };


    const handleInsertProduct = async () => {
        await fetchProducts()
        setInsertOwner(!insertOwner);

    }
    return (
        <>

            <div className="box-table">
                <div className="btn-add " >
                    <Button variant="primary" className="btn-item" onClick={handleInsertProduct}>
                        Add Product
                    </Button>
                </div>
                <div className="table">
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
                                    <td>{product.category}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            className="btn-item"
                                            onClick={() => setEditProductId(product.p_id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="btn-item"
                                            onClick={() => setDeleteProductId(product.p_id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>

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

            {insertOwner && (
                <InsertProduct insertProduct={handleInsertProduct} />
            )}

        </>
    );
}

export default Product;
