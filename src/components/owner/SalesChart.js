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
import { Card, Select } from 'antd'; // Import Card และ Select จาก Ant Design
import axios from 'axios';

const { Option } = Select;

function SalesChart() {
    const [monthlySales, setMonthlySales] = useState([]);
    const [chartType, setChartType] = useState('monthly'); // สร้าง state สำหรับเลือกประเภทกราฟ

    useEffect(() => {
        const fetchMonthlySales = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/graphmonthly');
                console.log(res.data);
                setMonthlySales(res.data);
            } catch (error) {
                console.log(error.response);
                return error.response;
            }
        };
        fetchMonthlySales();
    }, []);

    // สร้าง array ของเดือนทั้ง 12 เดือน
    const allMonths = [
        { name: 'Jan', monthly: '2024-01', total_price: 0 },
        { name: 'Feb', monthly: '2024-02', total_price: 0 },
        { name: 'Mar', monthly: '2024-03', total_price: 0 },
        { name: 'Apr', monthly: '2024-04', total_price: 0 },
        { name: 'May', monthly: '2024-05', total_price: 0 },
        { name: 'Jun', monthly: '2024-06', total_price: 0 },
        { name: 'Jul', monthly: '2024-07', total_price: 0 },
        { name: 'Aug', monthly: '2024-08', total_price: 0 },
        { name: 'Sept', monthly: '2024-09', total_price: 0 },
        { name: 'Oct', monthly: '2024-10', total_price: 0 },
        { name: 'Nov', monthly: '2024-11', total_price: 0 },
        { name: 'Dec', monthly: '2024-12', total_price: 0 },
    ];

    // ผสานข้อมูลยอดขายกับเดือนทั้งหมด
    const mergedSalesData = allMonths.map((month) => {
        const salesData = monthlySales.find((sale) => sale.monthly === month.monthly);
        return salesData ? { ...month, total_price: parseFloat(salesData.total_price) } : month;
    });

    // ฟังก์ชันเปลี่ยนประเภทกราฟ
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
                    data={mergedSalesData} // กำหนดข้อมูลที่แปลงแล้วให้กราฟ
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="name" /> {/* แสดงชื่อเดือนทั้งหมด */}
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {chartType === 'monthly' && (
                        <>
                            <Bar dataKey="total_price" barSize={20} fill="#413ea0" /> {/* กำหนดยอดขาย */}
                            <Line type="monotone" dataKey="total_price" stroke="#ff7300" /> {/* เส้นกราฟยอดขาย */}
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
