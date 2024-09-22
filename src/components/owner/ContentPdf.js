import React, { useEffect, useState } from "react";
import axios from "axios";
import './contentpdf.css'

function ContentPdf({ date }) {
    const [productList, setProductList] = useState();
    const [sales, setSales] = useState()
    const [topProducts, setTopProducts] = useState()
    const [paymentType, setPaymentType] = useState()


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
                } catch (error) {
                    console.log(error.response);
                }
            } else {
                console.log("No date range selected");
            }
        };
        fetchProduct();
    }, [date]);

    return (
        <div className="contentflexpdf">
            <div className="label">Khathong Coffee Shop</div>
            <div className="saleReport">
                <div className="label">Sales Report</div>
                <div>
                    On {date && date.start && date.end ?
                        (date.start === date.end ? date.start : `${date.start} To ${date.end}`)
                        : 'ไม่ระบุ'}
                </div>
            </div>

            <div className="label">*** Sales Summary ***</div>
            <div className="sales">
                <div className="label">Gross Sales</div>
                <div className="value">{sales
                    ? sales.total_amount
                    : '0'
                }
                </div>
                <div className="label">Discount</div>
                <div className="value">2400</div>
                <div className="label">Net Sales</div>
                <div className="value">17600</div>
                <div className="label">Tax</div>
                <div className="value">{sales
                    ? (sales.total_amount - (sales.total_amount * (100 / 107))).toFixed(2)
                    : '0'
                }</div>
            </div>

            <div className="label">*** Payment Methods ***</div>
            <div className="paymentMethods">
                {paymentType && paymentType.map((type) => (
                    <div className="paymentRow" key={type.payment_type}>
                        <div className="label">
                            {type.payment_type.charAt(0).toUpperCase() + type.payment_type.slice(1)}
                        </div>
                        <div className="value">{type.total_sales}</div>
                    </div>
                ))}
            </div>

            <div className="label">*** Product Sold Summary ***</div>

            <div className="productSold">
                <p className="label">ID</p>
                <p className="label">Name</p>
                <p className="label">Qty</p>
                <p className="label">Price</p>
                <p className="label">Amount</p>
            </div>
            <div className="productSold">
                <p>---------------------,</p>
                <p>---------------------,</p>
                <p>---------------------,</p>
                <p>---------------------,</p>
                <p>---------------------,</p>
            </div>

            {productList && productList.map((product) => (
                <div className="productSold" key={product.p_id}>
                    <p>{product.p_id}</p>
                    <p>{product.name}</p>
                    <p>{product.qty}</p>
                    <p>{product.price}</p>
                    <p>{product.amount}</p>
                </div>
            ))}

            <div className="productSold">
                <p>---------------------,</p>
                <p>---------------------,</p>
                <p>---------------------,</p>
                <p>---------------------,</p>
                <p>---------------------,</p>
            </div>

            <div className="label">*** Top-Selling Products ***</div>
            <div>
                {topProducts && topProducts.map((product, i) => (
                    <div className="topsales" key={product.product_id}>
                        <div className="label">{i + 1}. {product.Product_Name}</div>
                        <div className="value">(Qty:{product.quantity})</div>
                    </div>
                ))}
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