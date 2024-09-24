import { Document, Page, Text, View, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from 'antd';



function DownloadPdf({ date }) {
    const [productList, setProductList] = useState();
    const [sales, setSales] = useState()
    const [topProducts, setTopProducts] = useState()
    const [paymentType, setPaymentType] = useState()
    const [discount, setDiscount] = useState()


    useEffect(() => {
        const fetchProduct = async () => {
            if (date && date.start && date.end) { // ตรวจสอบว่ามีวันที่ถูกเลือก
                try {
                    const res = await axios.get(`http://localhost:5000/api/reportsales/${date.start}/${date.end}`);
                    console.log("product", res.data);
                    setProductList(res.data.products);
                    setSales(res.data.totalSales)
                    setTopProducts(res.data.topProducts)
                    setPaymentType(res.data.paymentTypes)
                    setDiscount(res.data.redeemPoints)
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
            <Page size="A4" style={{ padding: 20 }}>
                <View style={{ textAlign: 'center', marginBottom: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Khathong Coffee Shop</Text>
                    <Text style={{ fontSize: 18, marginTop: 5 }}>Sales Report</Text>
                    <Text style={{ marginTop: 5 }}>
                        On {date && date.start && date.end ?
                            (date.start === date.end ? date.start : `${date.start} To ${date.end}`) :
                            'ไม่ระบุ'}
                    </Text>
                </View>

                <Text style={{ fontSize: 16, marginTop: 10, textAlign: 'left' }}>*** Sales Summary ***</Text>
                <View style={{ marginBottom: 5, border: '1px solid black', padding: 10 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold' }}>Gross Sales:</Text>
                        <Text>{sales && sales.total_amount !== null && sales.total_amount !== undefined ? sales.total_amount : '0.00'}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold' }}>Discount:</Text>
                        <Text>{discount && discount.length > 0 ? discount.reduce((total, item) => total + Number(item.total_redeem_value), 0).toFixed(2) : '0.00'}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold' }}>Net Sales:</Text>
                        <Text>{discount && discount.length > 0 && sales && sales.total_amount !== null && sales.total_amount !== undefined ? sales.total_amount - discount.reduce((total, item) => total + Number(item.total_redeem_value), 0) : '0.00'}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold' }}>Tax:</Text>
                        <Text>{discount && discount.length > 0 && sales && sales.total_amount !== null && sales.total_amount !== undefined ? ((sales.total_amount - discount.reduce((total, item) => total + Number(item.total_redeem_value), 0).toFixed(2)) * (100 / 107)).toFixed(2) : '0.00'}</Text>
                    </View>
                </View>

                <Text style={{ fontSize: 16, marginTop: 10 }}>*** Payment Methods ***</Text>
                <View style={{ marginBottom: 10 }}>
                    {paymentType && paymentType.map((type) => (
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} key={type.payment_type}>
                            <Text>{type.payment_type.charAt(0).toUpperCase() + type.payment_type.slice(1)}:</Text>
                            <Text>{type.total_sales}</Text>
                        </View>
                    ))}
                </View>

                <Text style={{ fontSize: 16, marginTop: 10 }}>*** Product Sold Summary ***</Text>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottom: '1px solid black', marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', flex: '1  ', margin: '0' }}>ID</Text>
                    <Text style={{ fontWeight: 'bold', flex: '2  ', margin: '0' }}>Name</Text>
                    <Text style={{ fontWeight: 'bold', flex: '1  ', margin: '0' }}>Qty</Text>
                    <Text style={{ fontWeight: 'bold', flex: '1  ', margin: '0' }}>Price</Text>
                    <Text style={{ fontWeight: 'bold', flex: '1  ', margin: '0' }}>Amount</Text>
                </View>

                {productList && productList.map((product) => (
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '10px', }} key={product.p_id}>
                        <Text style={{ flex: '1  ', margin: '0' }}>{product.p_id}</Text>
                        <Text style={{ flex: '2  ', margin: '0' }}>{product.name}</Text>
                        <Text style={{ flex: '1  ', margin: '0', textAlign: 'left' }}>{product.qty}</Text>
                        <Text style={{ flex: '1  ', margin: '0' }}>{product.price}</Text>
                        <Text style={{ flex: '1  ', margin: '0' }}>{product.amount}</Text>
                    </View>
                ))}
                <Text style={{ borderBottom: '1px solid black', paddingTop: '10px' }}></Text>

                <Text style={{ fontSize: 16, marginTop: 10 }}>*** Top-Selling Products ***</Text>
                {topProducts && topProducts.map((product, i) => (
                    <Text key={product.product_id}>{i + 1}. {product.Product_Name} (Qty: {product.quantity})</Text>
                ))}
            </Page>
        </Document>
    );

    return (
        <div>
            {/* <PDFViewer style={{ width: '100%', height: '600px' }}>
                {pdfDocument}
            </PDFViewer> */}
            <Button type="primary">
                <PDFDownloadLink style={{textDecoration:'none'}}
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
