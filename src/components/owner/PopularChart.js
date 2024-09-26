import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, Select, DatePicker } from 'antd';
import './dashboard.css';
import axios from 'axios';
import dayjs from 'dayjs';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#6A5ACD'];
const { Option } = Select;
const monthFormat = 'YYYY-MM';
const yearFormat = 'YYYY';

function PopularChart() {
    const [topProduct, setTopProduct] = useState([]);
    const [chartType, setChartType] = useState('monthly');
    const [selectedDate, setSelectedDate] = useState(dayjs());

    useEffect(() => {
        const fetchTopProduct = async () => {
            try {
                let formattedData = [];
                if (chartType === 'monthly') {
                    const formattedDate = selectedDate.format('YYYY-MM');
                    const res = await axios.get(`http://localhost:5000/api/topproductmonth/${formattedDate}`);
                    formattedData = res.data.map(item => ({
                        name: item.Product_Name,
                        value: parseFloat(item.quantity)
                    }));
                } else {
                    // For yearly, use the selected year
                    const formattedYear = selectedDate.format('YYYY');
                    const res = await axios.get(`http://localhost:5000/api/topproductyear/${formattedYear}`);
                    formattedData = res.data.map(item => ({
                        name: item.Product_Name,
                        value: parseFloat(item.quantity)
                    }));
                }
                setTopProduct(formattedData);
            } catch (error) {
                console.log(error.response);
            }
        };
        fetchTopProduct();
    }, [selectedDate, chartType]);

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const handleChartTypeChange = (value) => {
        setChartType(value);
        if (value === 'monthly') {
            setSelectedDate(dayjs()); // Reset date to current month when changing to monthly
        }
        // When changing to 'yearly', do not reset selectedDate
    };

    const handleDateChange = (date) => {
        if (date) {
            setSelectedDate(date); // Set selected date as moment object
        }
    };

    return (
        <Card
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Best Seller</span>
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
            className="chartPopularChart"
        >
            <div style={{ marginBottom: '16px', textAlign: 'right' }}>
                {chartType === 'monthly' ? (
                    <DatePicker
                        onChange={handleDateChange}
                        value={selectedDate} // Use value instead of defaultValue
                        format={monthFormat}
                        picker="month"
                    />
                ) : (
                    <DatePicker
                        onChange={handleDateChange}
                        value={selectedDate} // Use value instead of defaultValue
                        format={yearFormat}
                        picker="year"
                    />
                )}
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={topProduct}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={125}
                        fill={COLORS[0]}
                        labelLine={false}
                        label={renderCustomizedLabel}
                        dataKey="value"
                    >
                        {topProduct.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
}

export default PopularChart;
