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
import { Card } from 'antd';
import axios from 'axios';
import moment from 'moment';

function SalesChart() {
    const [monthlySales, setMonthlySales] = useState([]);
    const [oldMonthlySales, setOldMonthlySales] = useState([]);
    const [redeemCounts, setRedeemCounts] = useState([]); // Initialize as an array
    const currentYear = moment().format('YYYY'); // Current year
    const oldYear = moment().subtract(1, 'years').format('YYYY'); // Previous year

    useEffect(() => {
        const fetchOldMonthlySales = async () => {
            try {
                const res = await axios.post(`http://localhost:5000/api/graphmonthly/${oldYear}`);
                const updatedOldSales = res.data.map(sale => ({
                    ...sale,
                    total_price: parseFloat(sale.total_price) * 1.10 // Increase by 10%
                }));
                setOldMonthlySales(updatedOldSales);
                console.log('old', res.data);
            } catch (error) {
                console.log(error.response);
            }
        };

        const fetchMonthlySales = async () => {
            try {
                const res = await axios.post(`http://localhost:5000/api/graphmonthly/${currentYear}`);
                setMonthlySales(res.data);
                console.log('new', res.data);
            } catch (error) {
                console.log(error.response);
            }
        };

        const fetchRedeem = async () => {
            try {
                const pointTypeRes = await axios.post(`http://localhost:5000/api/pointstypeyear/${currentYear}`);
                const pointTypeData = pointTypeRes.data;

                // Filter redeem data
                const redeemData = pointTypeData.filter(item => item.type === 'redeem');

                // Count redeems for each month
                const redeemCountByMonth = generateMonths(currentYear).map(month => {
                    const count = redeemData.filter(item =>
                        moment(item.order_date_time).format('YYYY-MM') === month.monthly
                    ).length;
                    return {
                        ...month,
                        redeem_count: count // Add redeem count per month
                    };
                });

                console.log(redeemCountByMonth); // Display results
                return redeemCountByMonth; // Return the count for use later
            } catch (error) {
                console.log(error.response);
            }
        };

        const loadSalesData = async () => {
            const redeemCounts = await fetchRedeem();
            await fetchMonthlySales();
            await fetchOldMonthlySales();
            setRedeemCounts(redeemCounts); // Store redeem counts to state
        };

        loadSalesData();
    }, [currentYear, oldYear]);

    // Function to create dynamic month data
    const generateMonths = (year) => {
        return Array.from({ length: 12 }, (_, i) => ({
            name: moment().month(i).format('MMM'),
            monthly: `${year}-${String(i + 1).padStart(2, '0')}`,
            total_price: 0,
            redeem_count: 0 // Add redeem_count
        }));
    };

    // Create month data for current and previous years
    const allMonths = generateMonths(currentYear);
    const mergedSalesData = allMonths.map((month) => {
        const salesData = monthlySales.find((sale) => sale.monthly === month.monthly);
        const oldSalesData = oldMonthlySales.find((sale) => sale.monthly === month.monthly.replace(currentYear, oldYear));
        const redeemCount = redeemCounts.find((redeem) => redeem.monthly === month.monthly)?.redeem_count || 0;

        const total_price = salesData ? Math.round(parseFloat(salesData.total_price)) : 0; // Round total price
        const adjusted_total_price = total_price - (redeemCount * 5); // Adjust total price by redeem count

        return {
            ...month,
            total_price: adjusted_total_price, // Use adjusted total price
            old_total_price: oldSalesData ? Math.round(parseFloat(oldSalesData.total_price)) : 0, // Round old total price
        };
    });

    
    return (
        <Card
            title={(
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Sales Chart</span>
                </div>
            )}
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
                    <Bar dataKey="total_price" name='Total Monthly' barSize={20} fill="#413ea0" />
                    <Line type="monotone" dataKey="old_total_price" name='Goal' stroke="#ff0000" /> {/* Red line */}
                </ComposedChart>
            </ResponsiveContainer>
        </Card>
    );
}

export default SalesChart;
