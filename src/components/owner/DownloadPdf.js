import { Document, Page, Text, View, PDFDownloadLink } from '@react-pdf/renderer';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from 'antd'; 

function DownloadPdf({ date }) {
    const [productList, setProductList] = useState();
    const [sales, setSales] = useState();
    const [topProducts, setTopProducts] = useState();
    const [paymentType, setPaymentType] = useState();
    const [discount, setDiscount] = useState();

    useEffect(() => {
        const fetchProduct = async () => {
            if (date && date.start && date.end) {
                try {
                    const res = await axios.get(`http://localhost:5000/api/reportsales/${date.start}/${date.end}`);
                    setProductList(res.data.products);
                    setSales(res.data.totalSales);
                    setTopProducts(res.data.topProducts);
                    setPaymentType(res.data.paymentTypes);
                    setDiscount(res.data.redeemPoints);
                } catch (error) {
                    console.log(error.response);
                }
            } else {
                console.log("No date range selected");
            }
        };
        fetchProduct();
    }, [date]);

    const pdfDocument = (
        <Document>
            {/* กำหนดขนาดกระดาษแบบ custom 72x297mm */}
            <Page size={{ width: 72, height: 297 }} style={{ padding: 20 }}>
                <View style={{ textAlign: 'center', marginBottom: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Khathong Coffee Shop</Text> {/* เพิ่มขนาดฟอนต์ */}
                    <Text style={{ fontSize: 14, marginTop: 5 }}>Sales Report</Text>
                    <Text style={{ marginTop: 5 }}>
                        On {date && date.start && date.end ? (date.start === date.end ? date.start : `${date.start} To ${date.end}`) : 'ไม่ระบุ'}
                    </Text>
                </View>

                <Text style={{ fontSize: 14, marginTop: 10 }}>*** Sales Summary ***</Text> {/* เพิ่มขนาดฟอนต์ */}
                <View style={{ marginBottom: 10, padding: 10, border: '1px solid black' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Gross Sales:</Text>
                        <Text style={{ fontSize: 12 }}>{sales?.total_amount || '0.00'}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Discount:</Text>
                        <Text style={{ fontSize: 12 }}>{discount?.length > 0 ? discount.reduce((total, item) => total + Number(item.total_redeem_value), 0).toFixed(2) : '0.00'}</Text>
                    </View>
                </View>

                <Text style={{ fontSize: 14, marginTop: 10 }}>*** Payment Methods ***</Text> {/* เพิ่มขนาดฟอนต์ */}
                <View style={{ marginBottom: 10 }}>
                    {paymentType && paymentType.map((type) => (
                        <View key={type.payment_type} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                            <Text style={{ fontSize: 12 }}>{type.payment_type}:</Text>
                            <Text style={{ fontSize: 12 }}>{type.total_sales}</Text>
                        </View>
                    ))}
                </View>

                <Text style={{ fontSize: 14, marginTop: 10 }}>*** Product Sold Summary ***</Text> {/* เพิ่มขนาดฟอนต์ */}
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottom: '1px solid black', marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>ID</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Name</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Qty</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Price</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Amount</Text>
                </View>

                {productList && productList.map((product) => (
                    <View key={product.p_id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                        <Text style={{ fontSize: 12 }}>{product.p_id}</Text>
                        <Text style={{ fontSize: 12 }}>{product.name}</Text>
                        <Text style={{ fontSize: 12 }}>{product.qty}</Text>
                        <Text style={{ fontSize: 12 }}>{product.price}</Text>
                        <Text style={{ fontSize: 12 }}>{product.amount}</Text>
                    </View>
                ))}

                <Text style={{ borderBottom: '1px solid black', marginTop: 10 }}></Text>
                <Text style={{ fontSize: 14, marginTop: 10 }}>*** Top-Selling Products ***</Text> {/* เพิ่มขนาดฟอนต์ */}
                {topProducts && topProducts.map((product, i) => (
                    <Text key={product.product_id} style={{ fontSize: 12 }}>{i + 1}. {product.Product_Name} (Qty: {product.quantity})</Text>
                ))}
            </Page>
        </Document>
    );

    return (
        <div>
            <Button type="primary">
                <PDFDownloadLink style={{ textDecoration: 'none' }}
                    document={pdfDocument}
                    fileName="sales_report.pdf"
                >
                    {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
                </PDFDownloadLink>
            </Button>
        </div>
    );
}

export default DownloadPdf;
