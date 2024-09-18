import React, { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Space, Table, Tag } from 'antd';
import moment from "moment";
import axios from "axios";

function ContentPdf() {
    const [product, setProduct] = useState()

    useEffect(() => {
        const fetchProduct = async () => {
            try {

                const res = await axios.get('http://localhost:5000/api/products')
                console.log('product', res.data)
                setProduct(res.data)
            } catch (error) {
                console.log(error.response)
            }
        }
        fetchProduct()
    }, [])

    console.log('set' , product.p_id)
    const columnsProducts = [
        {
            title: 'ID',
            dataIndex: 'p_id',
            key: 'id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Name',
            dataIndex: 'p_name',
            key: 'p_name',
        },
        {
            title: 'Qty',
            dataIndex: 'Qty',
            key: 'qty',
        },
        {
            title: 'Price',
            key: 'p_price',
            dataIndex: 'p_price',
        },
        {
            title: 'Amount',
            key: 'Amount',
            dataIndex: 'amount',
        },
    ];

    const columnsCetagory = [
        {
            title: 'ID',
            dataIndex: 'p_id',
            key: 'id',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Name',
            dataIndex: 'p_name',
            key: 'p_name',
        },
        {
            title: 'Qty',
            dataIndex: 'Qty',
            key: 'qty',
        },
        {
            title: 'Price',
            key: 'p_price',
            dataIndex: 'p_price',
        },
        {
            title: 'Amount',
            key: 'Amount',
            dataIndex: 'amount',
        },
    ];




   


    return (

        <Document>
            <Page
                size={"A4"}
                className='contentPdf'
            >
                <Text> Khathong Coffee Shop</Text>
                <Text> Sales Report</Text>
                <Text> On 17-9-2024</Text>
                <Text> *** Sales ***</Text>
                <Text> *** Sales ***</Text>
                <Text> Gross</Text>
                <Text> 20000</Text>
                <Text> Discount</Text>
                <Text> 2400</Text>
                <Text> Cash</Text>
                <Text> 5700</Text>
                <Text> Promtpay</Text>
                <Text> 4300</Text>
                <Text> *** Product Sold ***</Text>
                <Table columns={columnsProducts} dataSource={product} />
                <Text> *** Product By Category ***</Text>
                <Table columns={columnsProducts} dataSource={columnsCetagory} />


            </Page>

        </Document>
    )


}

export default ContentPdf