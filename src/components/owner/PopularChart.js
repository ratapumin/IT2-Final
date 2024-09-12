import React, { useState } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer, Cell,Tooltip } from 'recharts';
import { Card } from 'antd'; // Import Card component from Ant Design
import './dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function PopularChart() {
    const [activeIndex, setActiveIndex] = useState(0);

    const data = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
    ];

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

                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={125}
                        fill={COLORS[0]} // Default fill color
                        labelLine={false}
                        label={renderCustomizedLabel}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
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
