import axios from "axios";
import { useState, useEffect } from "react";
import { Modal, Input, Select, notification } from "antd";

const { Option } = Select;

function EditProducts({ product, saveEdit }) {
    const [currentProduct, setCurrentProduct] = useState(product);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        if (product) {
            setCurrentProduct(product);
            setIsModalVisible(true);
        } else {
            setIsModalVisible(false);
        }
    }, [product]);

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

        if (currentProduct.p_price.trim() === "") {
            notification.warning({
                message: "Warning",
                description: "Price cannot be empty.",
                placement: "topRight",
                duration: 3,
            });
            return; // Don't proceed if the price is empty
        }

        try {
            await axios.put(
                `http://localhost:5000/api/products/${currentProduct.p_id}`,
                currentProduct
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
    };

    return (
        <Modal
            title="Edit Product"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
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
        </Modal>
    );
}

export default EditProducts;
