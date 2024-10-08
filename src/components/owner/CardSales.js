import { Card } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../user/UserContext';

function CardSales() {
    const [dailySales, setDailySales] = useState();
    const [monthlySales, setMonthlySales] = useState();
    const [yearSales, setYearSales] = useState();
    const navigate = useNavigate();
    const { user } = useUser();
    const [token, setToken] = useState();

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

        fetchSales();
        fetchMonthlySales();
        fetchYearSales();
    }, []);

    return (
        <>
            <Card
                title="Daily sales"
                bordered={false}
                style={{ width: 300, height: 150 }}
            >
                <p>
                    {dailySales ? `${dailySales.TotalSales}` : '0'}
                </p>
            </Card>
            <Card
                title="Monthly sales"
                bordered={false}
                style={{ width: 300, height: 150 }}
            >
                <p>
                    {monthlySales ? ` ${monthlySales.TotalSales}` : '0'}
                </p>
            </Card>
            <Card
                title="Annual sales"
                bordered={false}
                style={{ width: 300, height: 150 }}
            >
                <p>
                    {yearSales ? `${yearSales.TotalSales}` : '0'}
                </p>
            </Card>
        </>
    );
}

export default CardSales;
