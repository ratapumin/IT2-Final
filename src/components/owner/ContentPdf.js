import React, { useEffect, useState } from "react";
import { Page, Text, Document, PDFViewer, StyleSheet } from "@react-pdf/renderer";
import { Table } from "antd";
import axios from "axios";
import './contentpdf.css'
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



    return (
        <div className="contentflexpdf">
            <div>Khathong Coffee Shop</div>
            <div className="saleReport">
                <div>Sales Report</div>
                <div>On 17-9-2024</div>
            </div>

            <div>*** Sales Summary ***</div>
            <div className="sales">
                <div className="label">Gross Sales</div>
                <div className="value">20000</div>
                <div className="label">Discount</div>
                <div className="value">2400</div>
                <div className="label">Net Sales</div>
                <div className="value">17600</div>
                <div className="label">Tax</div>
                <div className="value">800</div>
            </div>

            <div>*** Payment Methods ***</div>
            <div className="sales">
                <div className="label">Cash</div>
                <div className="value">5700</div>
                <div className="label">Promtpay</div>
                <div className="value">4300</div>
                <div className="label">Credit Card</div>
                <div className="value">6000</div>
            </div>

            <div>*** Product Sold Summary ***</div>
            <div className="productSold">
                <p>ID</p>
                <p>Name</p>
                <p>Qty</p>
                <p>Price</p>
                <p>Amount</p>
            </div>
            <div className="productSold">
                <p>---------------------,</p>
                <p>---------------------,</p>
                <p>---------------------,</p>
                <p>---------------------,</p>
                <p>---------------------,</p>
            </div>

            {product && product.map((item) => (
                <div className="productSold" key={item.p_id}>
                    <p>{item.p_id}</p>
                    <p>{item.p_name}</p>
                    <p>{item.qty}</p>
                    <p>{item.p_price}</p>
                    <p>{item.amount}</p>
                </div>
            ))}

            <div className="productSold">
                <p>---------------------,</p>
                <p>---------------------,</p>
                <p>---------------------,</p>
                <p>---------------------,</p>
                <p>---------------------,</p>
            </div>

            <div>*** Top-Selling Products ***</div>
            <div className="productSold">
                <p>1. Product A (Qty: 30)</p>
                <p>2. Product B (Qty: 25)</p>
                <p>3. Product C (Qty: 15)</p>
            </div>

            <div>*** Refunds ***</div>
            <div className="sales">
                <div className="label">Total Refunds</div>
                <div className="value">500</div>
            </div>

            <div>*** Employee Performance ***</div>
            <div className="sales">
                <div className="label">Employee A</div>
                <div className="value">Sales: 12000</div>
                <div className="label">Employee B</div>
                <div className="value">Sales: 8000</div>
            </div>
        </div>
    );

}

export default ContentPdf;





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