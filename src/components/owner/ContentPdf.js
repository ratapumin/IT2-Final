import React, { useEffect, useState } from "react";
import axios from "axios";
import './contentpdf.css'
import { Empty } from 'antd';
import { useUser } from '../user/UserContext';
import { useNavigate } from 'react-router-dom';

function ContentPdf({ date, statusPrint, handleonPrint, products }) {
    const [productList, setProductList] = useState([]);
    const [sales, setSales] = useState()
    const [topProducts, setTopProducts] = useState()
    const [paymentType, setPaymentType] = useState()
    const [discount, setDiscount] = useState()
    const [monthlySales, setMonthlySales] = useState()
    const [yearSales, setYearSales] = useState()
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        if (!user || user.role === 'O') {
            navigate('/protected');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchProduct = async () => {
            if (date && date.start && date.end) {
                console.log(date);
                console.log('eiie', statusPrint);
                try {
                    const res = await axios.post(`http://localhost:5000/api/printReportsales/${date.start}/${date.end}`, {
                        statusPrint,
                        user_fname: user.user_fname,
                        user_lname: user.user_lname
                    });

                    console.log("product", res.data.productsResults);

                    // ตั้งค่า state ตามข้อมูลที่ได้มา
                    setProductList(res.data.productsResults || []);
                    setSales(res.data.totalSalesResults[0] || {});
                    setTopProducts(res.data.topProductsResults || []);
                    setPaymentType(res.data.paymentTypeResults || []);
                    setDiscount(res.data.redeemResults || []);
                    setMonthlySales(res.data.monthlySalesResults || []);
                    setYearSales(res.data.yearlySalesResults || []);
                    products(res.data.productsResults)
                    // ตรวจสอบว่ามีข้อมูล productsResults หรือไม่
                    if (productList.length === 0) {
                        handleonPrint('no');
                        console.log("productList", productList);

                    } else {
                        console.log("productList", productList);
                        handleonPrint('print');
                    }
                } catch (error) {
                    console.log(error.response);
                }
            } else {
                console.log("No date range selected");
                console.log(date);
            }
        };
        fetchProduct();
    }, [date]);


    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 }).format(Number(value));
    };



    return (
        <>
            {(productList.length > 0 && (date && date.start && date.end)) ? (

                <div className="contentflexpdf" >
                    <div className="label">Khathong Coffee Shop</div>
                    <div className="saleReport">
                        <div className="label">Sales Report</div>
                        <div>
                            On {date && date.start && date.end ?
                                (date.start === date.end ? date.start : `${date.start} To ${date.end}`)
                                : 'ไม่ระบุ'}
                        </div>
                    </div>
                    <div className="saleReport">
                        <div className="label">User : </div>
                        <div>
                            {user
                                ? (`${user.user_fname.charAt(0).toUpperCase() + user.user_fname.slice(1)} ${user.user_lname.charAt(0).toUpperCase() + user.user_lname.slice(1)}`)
                                : 'Unknown'
                            }
                        </div>
                    </div>
                    <span>-------------------------------------------------------------------</span>
                    <div className="label">*** Sales Summary ***</div>
                    {/* <span>-------------------------------------------------------------------</span> */}
                    <div className="sales" >
                        <div className="label">Gross Sales</div>
                        <div className="value">
                            {sales && sales.total_amount !== null && sales.total_amount !== undefined
                                ? formatCurrency(
                                    (Number(sales.total_amount) || 0).toFixed(2)  // Ensure it's a number
                                )
                                : '0.00'
                            }
                        </div>
                        <div className="label">Discount</div>
                        <div className="value">
                            {discount && discount.length > 0
                                ?
                                formatCurrency(
                                    discount.reduce((total, item) => total + Number(item.total_redeem_value), 0).toFixed(2)
                                )
                                : '0.00'}
                        </div>
                        <div className="label">Tax</div>
                        <div className="value">
                            {discount && discount.length > 0 && sales && sales.total_amount !== null && sales.total_amount !== undefined
                                ? (
                                    (sales.total_amount - discount.reduce((total, item) => total + Number(item.total_redeem_value), 0).toFixed(2))
                                    -
                                    (sales.total_amount - discount.reduce((total, item) => total + Number(item.total_redeem_value), 0).toFixed(2)) * ((100 / 107)
                                    )).toFixed(2)
                                : '0.00'
                            }</div>
                        <div className="label">Net Sales</div>
                        <div className="value">
                            {discount && discount.length > 0 && sales && sales.total_amount !== null && sales.total_amount !== undefined
                                ? (
                                    formatCurrency(
                                        ((sales.total_amount - discount.reduce((total, item) => total + Number(item.total_redeem_value), 0))
                                            *
                                            (100 / 107)).toFixed(2) // Fix the number before formatting
                                    )
                                )
                                : '0.00'
                            }
                        </div>

                    </div>
                    <span>-------------------------------------------------------------------</span>
                    <div className="label">*** Monthly Sales Summary ***</div>
                    <span>-------------------------------------------------------------------</span>
                    <div className="bothLabel">
                        <p>Month</p>
                        <p> Total Sales</p>
                    </div>
                    <div>
                        {monthlySales && monthlySales.map((month) => (
                            <div
                                className="bothLabel"
                                key={month.monthly}
                            >
                                <p>
                                    {month.monthly}
                                </p>
                                <p>
                                    {formatCurrency(Number(month.total_price).toFixed(2))}
                                </p>
                            </div>
                        ))}
                    </div>
                    <span>-------------------------------------------------------------------</span>
                    <div className="label">*** Yearly Sales Summary ***</div>
                    <span>-------------------------------------------------------------------</span>
                    <div className="bothLabel">
                        <p>Year</p>
                        <p> Total Sales</p>
                    </div>
                    <div>
                        {yearSales && yearSales.map((year) => (
                            <div className="bothLabel" key={year.total_price}>
                                <p>
                                    {year.year}
                                </p>
                                <p>
                                    {formatCurrency(Number(year.total_price).toFixed(2))}
                                </p>
                            </div>
                        ))}
                    </div>

                    <span>-------------------------------------------------------------------</span>
                    <div className="label">*** Product Sold Summary ***</div>
                    <span>-------------------------------------------------------------------</span>

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

                    {
                        productList && productList.map((product) => (
                            <div className="productSold" key={product.p_id}>
                                <p>{product.p_id}</p>
                                <p>{product.name}</p>
                                <p>{product.qty}</p>
                                <p>{product.price}</p>
                                <p>{formatCurrency(Number(product.amount).toFixed(2))}</p>
                            </div>
                        ))
                    }

                    <div className="productSold">
                        <p>---------------------,</p>
                        <p>---------------------,</p>
                        <p>---------------------,</p>
                        <p>---------------------,</p>
                        <p>---------------------,</p>
                    </div>
                    <span>-------------------------------------------------------------------</span>
                    <div className="label">*** Top 5 Products ***</div>
                    <span>-------------------------------------------------------------------</span>
                    <div>
                        {topProducts && topProducts.map((product, i) => (
                            <div className="topsales" key={product.product_id}>
                                <div className="label">{i + 1}. {product.Product_Name}</div>
                                <div className="value">(Qty:{product.quantity})</div>
                            </div>
                        ))}
                    </div>
                    <span>-------------------------------------------------------------------</span>
                    <div className="label">*** Sales Breakdown by Payment Type ***</div>
                    <span>-------------------------------------------------------------------</span>
                    <div className="paymentMethods">
                        {paymentType && paymentType.map((type) => (
                            <div className="paymentRow" key={type.payment_type}>
                                <div className="label">
                                    {type.payment_type.charAt(0).toUpperCase() + type.payment_type.slice(1)}
                                </div>
                                <div className="value">{formatCurrency(Number(type.total_sales).toFixed(2))} </div>
                            </div>
                        ))}
                    </div>
                    <span>-------------------------------------------------------------------</span>
                    <div className="label">*** Redeem Points Information ***</div>
                    <span>-------------------------------------------------------------------</span>
                    <div className="paymentMethods">
                        {discount && discount.map((point) => (
                            <div key={point.redeem_count}>
                                <div className="paymentRow">
                                    <div className="label">Redeem Point:</div>
                                    <div className="value">{formatCurrency(Number(point.redeem_count * 10).toFixed(2))}</div>
                                </div>
                                <div className="paymentRow">
                                    <div className="label">Discount (Baht):</div>
                                    <div className="value">{formatCurrency(Number(point.total_redeem_value).toFixed(2))}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div >
            ) : (
                <p
                    style={{ width: '100%', height: '90%', display: 'flex', placeContent: 'center', alignItems: 'center' }}
                >
                    <Empty />

                </p>
            )}

        </>
    );

}

export default ContentPdf;





