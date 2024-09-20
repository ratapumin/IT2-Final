import React, { useEffect, useState } from "react";
import { Page, Text, Document, PDFViewer, StyleSheet } from "@react-pdf/renderer";
import { Table } from "antd";
import axios from "axios";

function ContentPdf() {
    const [product, setProduct] = useState();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/products");
                console.log("product", res.data);
                setProduct(res.data);
            } catch (error) {
                console.log(error.response);
            }
        };
        fetchProduct();
    }, []);

    const columnsProducts = [
        {
            title: "ID",
            dataIndex: "p_id",
            key: "id",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Name",
            dataIndex: "p_name",
            key: "p_name",
        },
        {
            title: "Qty",
            dataIndex: "Qty",
            key: "qty",
        },
        {
            title: "Price",
            key: "p_price",
            dataIndex: "p_price",
        },
        {
            title: "Amount",
            key: "Amount",
            dataIndex: "amount",
        },
    ];

    // const pdfDocument = (
    //     <Document>
    //         <Page size="A4">
    //             <Text>Khathong Coffee Shop</Text>
    //             <Text>Sales Report</Text>
    //             <Text>On 17-9-2024</Text>
    //             <Text>*** Sales ***</Text>
    //             <Text>Gross</Text>
    //             <Text>20000</Text>
    //             <Text>Discount</Text>
    //             <Text>2400</Text>
    //             <Text>Cash</Text>
    //             <Text>5700</Text>
    //             <Text>Promtpay</Text>
    //             <Text>4300</Text>
    //             <Text>*** Product Sold ***</Text>
    //             <Table columns={columnsProducts} dataSource={product} />
    //         </Page>
    //     </Document>
    // );

    return (
        <div>
            {/* Use PDFViewer to display the PDF in-browser */}


            <div>Khathong Coffee Shop</div>
            <div>Sales Report</div>
            <div>On 17-9-2024</div>
            <div>*** Sales ***</div>
            <div>Gross</div>
            <div>20000</div>
            <div>Discount</div>
            <div>2400</div>
            <div>Cash</div>
            <div>5700</div>
            <div>Promtpay</div>
            <div>4300</div>
            <div>*** Product Sold ***</div>
            <Table columns={columnsProducts} dataSource={product} rowKey="p_id" />

        </div>
    );
}

export default ContentPdf;
