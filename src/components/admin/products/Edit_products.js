import axios from "axios";
import { useState, useEffect } from "react";
import { Modal, Input, Select, notification } from "antd";

const { Option } = Select;

function EditProducts({ product, saveEdit, productList }) {
    const [currentProduct, setCurrentProduct] = useState(product);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [oldId, setOldId] = useState('')
    useEffect(() => {
        if (product) {
            setCurrentProduct(product);
            setOldId(product.p_id)
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

        const price = String(currentProduct.p_price); // Ensure p_price is a string
        if (price.trim() === "") {
            notification.warning({
                message: "Warning",
                description: "Price cannot be empty.",
                placement: "topRight",
                duration: 3,
            });
            return; // Don't proceed if the price is empty
        }

        try {
            console.log(currentProduct)

            await axios.put(`http://localhost:5000/api/products/${oldId}`, currentProduct);
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

        // Allow only numeric input for p_price and limit it to 4 characters
        if (name === "p_price") {
            const regex = /^\d{0,4}$/; // Matches up to 4 digits
            if (regex.test(value)) {
                setCurrentProduct((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else {
            setCurrentProduct((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSelectChange = (name, value) => {
        setCurrentProduct((prev) => {
            const updatedProduct = {
                ...prev,
                [name]: value,
            };
            // Update the product ID based on selected type and category
            const newIdCounter = getNextProductId(updatedProduct.p_type, updatedProduct.category);
            updatedProduct.p_id = generateProductId(updatedProduct.p_type, updatedProduct.category, newIdCounter);
            return updatedProduct;
        });
    };

    const getNextProductId = (productType, category) => {
        const baseId = `${generateTypeCode(productType)}${generateCategoryCode(category)}`;
        const existingIds = productList.map(item => String(item.p_id)); // Ensure IDs are strings
        console.log('Existing IDs:', existingIds);
        console.log('Base ID:', baseId);

        let maxId = existingIds.reduce((max, id) => {
            if (typeof id === 'string' && id.startsWith(baseId)) { // Check if id is a string
                const suffix = parseInt(id.slice(-2), 10); // Extracting the last two digits
                return Math.max(max, suffix);
            }
            return max;
        }, 0);
        return maxId + 1; // Increment by 1 for the new product
    };


    const generateTypeCode = (productType) => {
        switch (productType) {
            case "Coffee":
                return "10";
            case "Tea":
                return "20";
            case "Chocolate":
                return "30";
            default:
                return "00"; // Default code for unknown types
        }
    };

    const generateCategoryCode = (category) => {
        return category === "ICE" ? "1" : category === "HOT" ? "2" : "0";
    };

    const generateProductId = (productType, category, counter) => {
        return `${generateTypeCode(productType)}${generateCategoryCode(category)}${String(counter).padStart(2, '0')}`; // Combine the codes with the counter
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
                    maxLength={4} // Limit input to 4 characters
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
