import axios from "axios";
import { useState, useEffect } from "react";
import { Modal, Input, Select, notification, Form } from "antd";

const { Option } = Select;

function EditProducts({ product, saveEdit, productList }) {
    const [currentProduct, setCurrentProduct] = useState(product);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [productIdPrefix, setProductIdPrefix] = useState('');
    const [form] = Form.useForm(); // สร้าง form ใหม่
    const [oldIdProduct,setOldIdProduct] = useState('')
    // console.log(currentProduct.p_id)

    useEffect(() => {
        if (product) {
            setCurrentProduct(product);
            setOldIdProduct(currentProduct.p_id)
            setIsModalVisible(true);
            const initialTypePrefix = getTypePrefix(product.p_type);
            const initialCategoryPrefix = product.category === 'ICE' ? '1' : '2';
            updateProductId(initialTypePrefix, initialCategoryPrefix);
        } else {
            setIsModalVisible(false);
        }
    }, [product]);
    // console.log(oldIdProduct)

    const getTypePrefix = (type) => {
        switch (type) {
            case 'Coffee':
                return '10';
            case 'Tea':
                return '20';
            case 'Chocolate':
                return '30';
            default:
                return '';
        }
    };

    const handleOk = async () => {
        // Check for empty values before sending
        if (currentProduct.p_name.trim() === "") {
            notification.warning({
                message: "Warning",
                description: "Product name cannot be empty.",
                placement: "topRight",
                duration: 3,
            });
            return; // Don't proceed if the product name is empty
        }
    
        const price = String(currentProduct.p_price).trim();
        if (price === "") {
            notification.warning({
                message: "Warning",
                description: "Price cannot be empty.",
                placement: "topRight",
                duration: 3,
            });
            return; // Don't proceed if the price is empty
        }
    
        // Update the product price to the string version
        setCurrentProduct((prev) => ({ ...prev, p_price: price }));
    
        try {
            console.log('qwe', currentProduct);
            // Send the request with the correct product ID
            await axios.put(
                `http://localhost:5000/api/products/${oldIdProduct}`, // Ensure p_id is correct here
                { 
                    p_id: currentProduct.p_id, // Include p_id in the request body
                    p_name: currentProduct.p_name,
                    p_price: price,
                    p_type: currentProduct.p_type,
                    category: currentProduct.category 
                }
            );
    
            notification.success({
                message: "Success",
                description: "Your product has been updated.",
                placement: "topRight",
                duration: 3,
            });
    
            saveEdit();
            setIsModalVisible(false);
        } catch (error) {
            console.log("Cannot edit product", error);
            notification.error({
                message: "Error",
                description: "There was a problem updating the product.",
                placement: "topRight",
                duration: 3,
            });
        }
    };
    
    
    const handleCancel = () => {
        setIsModalVisible(false);
        saveEdit();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCurrentProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name, value) => {
        setCurrentProduct((prev) => ({
            ...prev,
            [name]: value,
        }));

        // ตรวจสอบว่าเป็นประเภทผลิตภัณฑ์หรือหมวดหมู่และอัปเดต Product ID
        if (name === "p_type") {
            handleProductTypeChange(value);
        } else if (name === "category") {
            handleCategoryChange(value);
        }
    };

    const handleProductTypeChange = (value) => {
        let prefix = getTypePrefix(value);
        setProductIdPrefix(prefix);
        const categoryPrefix = currentProduct.category === 'ICE' ? '1' : '2';
        updateProductId(prefix, categoryPrefix);
    };

    const handleCategoryChange = (value) => {
        const categoryPrefix = value === 'ICE' ? '1' : '2';
        updateProductId(productIdPrefix, categoryPrefix);
    };

    const updateProductId = (typePrefix, categoryPrefix) => {
        const newProductIdPrefix = `${typePrefix}${categoryPrefix}`;
        
        // Defensive check
        if (!Array.isArray(productList)) {
            console.error("productList is not an array:", productList);
            return;
        }
    
        // Filter products with matching prefix
        const filteredProducts = productList.filter((product) =>
            String(product.p_id).startsWith(newProductIdPrefix)
        );
    
        // Find the maximum ID value
        const maxId = filteredProducts.length > 0
            ? Math.max(...filteredProducts.map((product) => {
                const pId = String(product.p_id);
                return parseInt(pId.slice(newProductIdPrefix.length)) || 0;
            }))
            : 0;
    
        // Increment the ID for the new product
        const nextId = String(maxId + 1).padStart(2, '0');
    
        // Set the new Product ID directly in currentProduct
        setCurrentProduct((prev) => ({
            ...prev,
            p_id: `${newProductIdPrefix}${nextId}`
        }));
    
        console.log('Filtered productList', filteredProducts);
        console.log('Next ID:', `${newProductIdPrefix}${nextId}`);
    };

    return (
        <Modal
            title="Edit Product"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form form={form}>
                <div style={{ marginBottom: 16 }}>
                    <label>Product ID</label>
                    <Input value={currentProduct.p_id} disabled />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Product Name</label>
                    <Input
                        name="p_name"
                        value={currentProduct.p_name}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Price</label>
                    <Input
                        name="p_price"
                        value={currentProduct.p_price}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ width: '48%' }}>
                        <label>Product Type</label>
                        <Select
                            value={currentProduct.p_type}
                            onChange={(value) => handleSelectChange("p_type", value)}
                            style={{ width: '100%' }}
                        >
                            <Option value="Coffee">Coffee</Option>
                            <Option value="Tea">Tea</Option>
                            <Option value="Chocolate">Chocolate</Option>
                            <Option value="Another">Another</Option>
                        </Select>
                    </div>
                    <div style={{ width: '48%' }}>
                        <label>Category</label>
                        <Select
                            value={currentProduct.category}
                            onChange={(value) => handleSelectChange("category", value)}
                            style={{ width: '100%' }}
                        >
                            <Option value="ICE">ICE</Option>
                            <Option value="HOT">HOT</Option>
                        </Select>
                    </div>
                </div>
            </Form>
        </Modal>
    );
}

export default EditProducts;
