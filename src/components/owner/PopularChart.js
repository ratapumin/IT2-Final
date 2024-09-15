import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from 'antd'; // Import Card component from Ant Design
import './dashboard.css';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function PopularChart() {
    const [topProduct, setTopProduct] = useState([]);

    useEffect(() => {
        const fetchTopProduct = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/topproduct');
                const formattedData = res.data.map(item => ({
                    name: item.Product_Name,
                    value: parseFloat(item.quantity) // ใช้ parseFloat เพื่อให้แน่ใจว่าเป็นตัวเลข
                }));
                setTopProduct(formattedData);
            } catch (error) {
                console.log(error.response);
            }
        };
        fetchTopProduct();
    }, []);

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Card title="Popular Sales" className="chartPopularChart">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={topProduct} // ใช้ข้อมูลจริงจาก topProduct
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={125}
                        fill={COLORS[0]} // Default fill color
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
