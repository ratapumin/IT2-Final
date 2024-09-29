import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { Modal, Form, Input, Select, Button, notification, Row, Col } from "antd";
const { Option } = Select;

function Insert_products({ insertProduct, productList }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [productIdPrefix, setProductIdPrefix] = useState('');
    const [partId, setPartId] = useState('');

    const productTypes = {
        Coffee: "Coffee",
        Tea: "Tea",
        Chocolate: "Chocolate",
    };

    const categories = {
        ICE: "ICE",
        HOT: "HOT",
    };
    useEffect(() => {
        console.log(productList)
    }, [productList]);





    const handleProductTypeChange = (value) => {
        let prefix;
        switch (value) {
            case 'Coffee':
                prefix = '10';
                break;
            case 'Tea':
                prefix = '20';
                break;
            case 'Chocolate':
                prefix = '30';
                break;
            default:
                prefix = '';
                break;
        }
        setProductIdPrefix(prefix);
        const categoryPrefix = form.getFieldValue('category') === 'ICE' ? '1' : '2';
        updateProductId(prefix, categoryPrefix);
    };

    const handleCategoryChange = (value) => {
        const categoryPrefix = value === 'ICE' ? '1' : '2';
        updateProductId(productIdPrefix, categoryPrefix);
        console.log(categoryPrefix)
    };

    const handlePart = (e) => {
        const value = e.target.value;
        setPartId(value);
        console.log('set value', value);
        const categoryPrefix = form.getFieldValue('category') === 'ICE' ? '1' : '2';
        updateProductId(productIdPrefix, categoryPrefix);
    };

    useEffect(() => {
        setIsModalVisible(true);

        const defaultTypePrefix = '10'; // Prefix สำหรับ Coffee
        const defaultCategoryPrefix = '1'; // Prefix สำหรับ ICE
        form.setFieldsValue({
            p_id: `${defaultTypePrefix}${defaultCategoryPrefix}`,
            editablePart: ''
        });

        setProductIdPrefix(defaultTypePrefix);
        updateProductId(defaultTypePrefix, defaultCategoryPrefix);
    }, [form, productList]);


    const updateProductId = (typePrefix, categoryPrefix) => {
        const newProductIdPrefix = `${typePrefix}${categoryPrefix}`;

        // ฟิลเตอร์สินค้าที่มี prefix ตรงกัน
        const filteredProducts = productList.filter((product) =>
            String(product.p_id).startsWith(newProductIdPrefix)
        );

        // หาค่าสูงสุดของเลขลำดับ
        const maxId = filteredProducts.length > 0
            ? Math.max(...filteredProducts.map((product) => {
                const pId = String(product.p_id);
                return parseInt(pId.slice(newProductIdPrefix.length)) || 0;
            }))
            : 0;

        // เพิ่มเลขลำดับถัดไป และเติม 0 ให้ครบ 2 หลัก
        const nextId = String(maxId + 1).padStart(2, '0');

        // ตั้งค่า Product ID ใหม่
        form.setFieldsValue({
            p_id: `${newProductIdPrefix}${nextId}`
        });

        console.log('Filtered productList', filteredProducts);
        console.log('Next ID:', `${newProductIdPrefix}${nextId}`);
    };






    const addProduct = useCallback(async (values) => {
        values.p_id = `${form.getFieldValue('p_id')}${partId}`;

        console.log('set  values.p_id', values.p_id);



        try {
            await axios.post(`http://localhost:5000/api/products`, values);
            notification.success({
                message: "Saved!",
                description: "Your product has been updated.",
            });
            form.resetFields();
            setIsModalVisible(false);
            insertProduct(true);
        } catch (error) {
            console.log("Cannot edit product", error);
            notification.error({
                message: "Error!",
                description: "There was a problem updating the product.",
            });
        }
    }, [form, insertProduct, partId]);

    const handleOk = () => {
        form
            .validateFields()
            .then(values => {
                addProduct(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        insertProduct(false);
    };

    return (
        <Modal
            title="Insert Product"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Save
                </Button>,
            ]}
        >
            <Form
                form={form}  // Make sure the form prop is passed here
                layout="vertical"
                initialValues={{ p_type: 'Coffee', category: 'ICE' }}
            >

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="p_type"
                            label="Product Type"
                            rules={[{ required: true, message: 'Please select the product type!' }]}
                        >
                            <Select onChange={handleProductTypeChange}>
                                {Object.keys(productTypes).map(type => (
                                    <Option key={type} value={type}>{productTypes[type]}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="category"
                            label="Category"
                            rules={[{ required: true, message: 'Please select the category!' }]}
                        >
                            <Select onChange={handleCategoryChange}>
                                {Object.keys(categories).map(cat => (
                                    <Option key={cat} value={cat}>{categories[cat]}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="p_id"
                            label="Product ID"
                            rules={[{ required: true, message: 'Product ID is required!' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                </Row> */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="p_name"
                            label="Product Name"
                            rules={[{ required: true, message: 'Please input the product name!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="p_price"
                            label="Price"
                            rules={[{ required: true, message: 'Please input the price!' }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

export default Insert_products;
