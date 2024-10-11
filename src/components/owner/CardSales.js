import { Card } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../user/UserContext';
import { BankOutlined, MobileOutlined } from '@ant-design/icons';

function CardSales() {
    const [dailySales, setDailySales] = useState();
    const [monthlySales, setMonthlySales] = useState();
    const [yearSales, setYearSales] = useState();
    const navigate = useNavigate();
    const { user } = useUser();
    const [token, setToken] = useState();
    const [totalCash, setTotalCash] = useState()
    const [totalpromptpay, setTotalpromptpay] = useState()

    // ตรวจสอบ role และนำทาง
    useEffect(() => {
        if (!user) {
            navigate('/protected');
        } else if (user.role_type === 'O' || user.role_type === 'o') {
            navigate('/dashboard');
        } else {
            navigate('/protected');
        }
    }, [user, navigate]);

    // ตรวจสอบ token
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            setToken(token);
        } else {
            navigate("/");
        }
    }, [token, navigate]);

    // เรียกข้อมูลยอดขาย
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const date_time = moment().format('YYYY-MM-DD');
                const res = await axios.get(`http://localhost:5000/api/daily/${date_time}`);
                console.log('daily', res.data[0]?.TotalSales);
                setDailySales(res.data[0]);
            } catch (error) {
                console.log('Error', error.message);
            }
        };

        const fetchMonthlySales = async () => {
            try {
                const date_time = moment().format('YYYY-MM');
                const res = await axios.get(`http://localhost:5000/api/monthly/${date_time}`);
                console.log('monthly', res.data[0]);
                setMonthlySales(res.data[0]);
            } catch (error) {
                console.log('Error', error.message);
            }
        };

        const fetchYearSales = async () => {
            try {
                const date_time = moment().format('YYYY');
                const res = await axios.get(`http://localhost:5000/api/year/${date_time}`);
                console.log('year', res.data[0]);
                setYearSales(res.data[0]);
            } catch (error) {
                console.log('Error', error.message);
            }
        };
        const fetchTotalPrice = async () => {
            try {
        
                const currentDate = moment().format('YYYY-MM-DD');
                const res = await axios.get(`http://localhost:5000/api/typesales/${currentDate}`);

                // แยกค่าออกตาม payment_type
                const cashData = res.data.find(item => item.payment_type === 'cash') || {};
                const promptpayData = res.data.find(item => item.payment_type === 'promtpay') || {};
console.log(res.data)
                setTotalCash(cashData.total || 0);
                setTotalpromptpay(promptpayData.total || 0)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchTotalPrice()
        fetchSales();
        fetchMonthlySales();
        fetchYearSales();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 }).format(value);
    }

    return (
        <>

            <Card
                title='Payment Method'
                bordered={false}
                style={{ width: 300, height: 150 }}
            >
                 <div className="paymentmethod">
            <div className="payment-item">
               CASH: <span >{formatCurrency(totalCash)}</span>
            </div>
            <div className="payment-item">
                PROMPTPAY: <span >{formatCurrency(totalpromptpay)}</span>
            </div>  
        </div>

            </Card>

            <Card
                title="Daily sales"
                bordered={false}
                style={{ width: 300, height: 150 }}
            >
                <p
                    style={{ fontSize: '50px' }}
                >

                    {dailySales ? `${formatCurrency(dailySales.TotalSales)}` : '0'}
                </p>
            </Card>
            <Card
                title="Monthly sales"
                bordered={false}
                style={{ width: 300, height: 150 }}
            >
                <p
                    style={{ fontSize: '50px' }}
                >
                    {monthlySales ? ` ${formatCurrency(monthlySales.TotalSales)}` : '0'}
                </p>
            </Card>
            <Card
                title="Annual sales"
                bordered={false}
                style={{ width: 300, height: 150 }}
            >
                <p
                    style={{ fontSize: '50px' }}
                >
                    {yearSales ? `${formatCurrency(yearSales.TotalSales)}` : '0'}
                </p>
            </Card>
        </>
    );
}

export default CardSales;
