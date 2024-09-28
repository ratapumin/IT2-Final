import React from 'react';
import './dashboard.css';
import CardSales from './CardSales';
import PopularChart from './PopularChart';
import SalesChart from './SalesChart';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../user/UserContext';
import { useEffect, useState } from "react";


function Dashboard() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [token, setToken] = useState();
    console.log(user)

    useEffect(() => {
        if (!user) {
            navigate('/protected');
        } else {
            if (user.role_type === 'O' || user.role_type === 'o') {
                navigate('/dashboard');
            } else {
                navigate('/protected');
            }
        }
    }, [user, navigate]);
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            setToken(token);
        } else {
            navigate("/");
        }
    }, [token, navigate]);

    return (
        <div className='bgDashboard' >
            <p>welcome Owner</p>
            <div className='contentDashboard'>

                <div className='flexCard'>
                    <CardSales />
                </div>
                <div className='flexChart'>
                    <SalesChart />
                    <PopularChart />
                </div>
            </div>

        </div>
    );
}

export default Dashboard;