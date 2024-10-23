    import axios from "axios";
    import { useEffect, useState } from "react";
    import { useNavigate } from 'react-router-dom';
    import { useUser } from "../../user/UserContext";
    import { Table, Button } from 'antd';
    import EditProduct from './Edit_products';
    import DeleteProducts from "./Delete_products";
    import InsertProduct from './Insert_products';
    import './product.css';

    function Product() {
        const [products, setProducts] = useState([]);
        const [editProductId, setEditProductId] = useState(null);
        const [deleteProductId, setDeleteProductId] = useState(null);
        const [insertOwner, setInsertOwner] = useState(false);
        const navigate = useNavigate();
        const { user } = useUser();
        const [currentPage, setCurrentPage] = useState(1); // State สำหรับหน้าปัจจุบัน
        const pageSize = 10; // จำนวนรายการต่อหน้า

        useEffect(() => {
            if (!user || user.role === 'A') {
                navigate('/protected');
            }
        }, [user, navigate]);

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
            await fetchProducts();
            setEditProductId(null); // This should trigger the EditProducts component to close
        };

        const handleonDelete = async () => {
            await fetchProducts();
            setDeleteProductId(null);
        };

        const handleInsertProduct = async (refresh) => {
            if (refresh) {
                await fetchProducts(); // Fetch products after inserting a new one
            }
            setInsertOwner(!insertOwner);
        };

        const columns = [
            {
                title: '#',
                render: (_, __, index) => (currentPage - 1) * pageSize + index + 1, // คำนวณหมายเลขที่ถูกต้อง
            },
            {
                title: 'ID',
                dataIndex: 'p_id',
                key: 'p_id',
            },
            {
                title: 'Name',
                dataIndex: 'p_name',
                key: 'p_name',
            },
            {
                title: 'Price',
                dataIndex: 'p_price',
                key: 'p_price',
            },
            {
                title: 'Type',
                dataIndex: 'p_type',
                key: 'p_type',
            },
            {
                title: 'Category',
                dataIndex: 'category',
                key: 'category',
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (_, record) => (
                    <>
                        <Button
                            className="bntEdit "
                            type="primary"
                            onClick={() => setEditProductId(record.p_id)}
                            style={{ marginRight: 8 }}
                        >
                            Edit
                        </Button>
                        <Button
                            className="btn-item"
                            danger
                            type="primary"
                            onClick={() => setDeleteProductId(record.p_id)}
                        >
                            Delete
                        </Button>
                    </>
                ),
            },
        ];

        return (
            <>
                <div className="box-table">
                    <div className="btn-add">
                        <Button type="primary" onClick={handleInsertProduct}>
                            Add Product
                        </Button>
                    </div>
                    <div className="table">
                        <Table
                            dataSource={products}
                            columns={columns}
                            rowKey="p_id"
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: products.length,
                                onChange: (page) => setCurrentPage(page), // อัปเดต currentPage เมื่อเปลี่ยนหน้า
                            }}
                        />
                    </div>
                </div>

                {editProductId && (
                    <EditProduct
                        product={products.find((p) => p.p_id === editProductId)}
                        saveEdit={handleSaveEdit}
                        productList={products}
                    />
                )}

                {deleteProductId && (
                    <DeleteProducts
                        product={products.find((p) => p.p_id === deleteProductId)}
                        onDelete={handleonDelete}
                    />
                )}

                {insertOwner && (
                    <InsertProduct
                        insertProduct={handleInsertProduct}
                        productList={products}
                    />
                )}
            </>
        );
    }

    export default Product;