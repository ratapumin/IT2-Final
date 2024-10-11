import React, { useEffect, useState } from 'react';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Card, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

function SalesChart() {
    const [monthlySales, setMonthlySales] = useState([]);
    const [chartType, setChartType] = useState('monthly');
    const [oldMonthlySales, setOldMonthlySales] = useState([]);
    const currentYear = moment().format('YYYY'); // กำหนดปีปัจจุบัน
    const oldYear = moment().subtract(1, 'years').format('YYYY'); // กำหนดปีเก่า

    useEffect(() => {
        const fetchOldMonthlySales = async () => {
            try {
                const res = await axios.post(`http://localhost:5000/api/graphmonthly/${oldYear}`);
                const updatedOldSales = res.data.map(sale => ({
                    ...sale,
                    total_price: parseFloat(sale.total_price) * 1.10 // เพิ่ม 10%
                }));
                setOldMonthlySales(updatedOldSales);
                console.log('old',res.data)
            } catch (error) {
                console.log(error.response);
            }
        };

        const fetchMonthlySales = async () => {
            try {
                const res = await axios.post(`http://localhost:5000/api/graphmonthly/${currentYear}`);
                setMonthlySales(res.data);
            } catch (error) {
                console.log(error.response);
            }
        };

        fetchMonthlySales();
        fetchOldMonthlySales();
    }, [currentYear, oldYear]);

    // ฟังก์ชันสร้างข้อมูลเดือนแบบ dynamic
    const generateMonths = (year) => {
        return Array.from({ length: 12 }, (_, i) => ({
            name: moment().month(i).format('MMM'),
            monthly: `${year}-${String(i + 1).padStart(2, '0')}`,
            total_price: 0
        }));
    };

    // สร้างข้อมูลเดือนสำหรับปีปัจจุบันและปีก่อนหน้า
    const allMonths = generateMonths(currentYear);

    const mergedSalesData = allMonths.map((month) => {
        const salesData = monthlySales.find((sale) => sale.monthly === month.monthly);
        const oldSalesData = oldMonthlySales.find((sale) => sale.monthly === month.monthly.replace(currentYear, oldYear));
    
        return {
            ...month,
            total_price: salesData ? Math.round(parseFloat(salesData.total_price)) : 0, // ปัดเศษทศนิยมออก
            old_total_price: oldSalesData ? Math.round(parseFloat(oldSalesData.total_price)) : 0, // ปัดเศษทศนิยมออก
        };
    });
    

    const handleChartTypeChange = (value) => {
        setChartType(value);
    };

    return (
        <Card
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Sales Chart</span>
                    <Select
                        defaultValue="monthly"
                        style={{ width: 200 }}
                        onChange={handleChartTypeChange}
                    >
                        <Option value="monthly">Monthly</Option>
                        <Option value="yearly">Yearly</Option>
                    </Select>
                </div>
            }
            className="cardSalesChart"
        >
            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart
                    data={mergedSalesData}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {chartType === 'monthly' && (
                        <>
                            <Bar dataKey="total_price" name='Total Monthly' barSize={20} fill="#413ea0" />
                            <Line type="monotone" dataKey="old_total_price" name='Goal' stroke="#ff0000" /> {/* เส้นสีแดง */}
                        </>
                    )}
                    {chartType === 'yearly' && (
                        <Line type="monotone" dataKey="total_price" stroke="#00aaff" />
                    )}
                </ComposedChart>
            </ResponsiveContainer>
        </Card>
    );
}

export default SalesChart;
