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
    const [currentTime, setCurrentTime] = useState(new Date());
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


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);  // Clear interval on component unmount
    }, []);


    return (
        <>


            <div className='bgDashboard' >
                <div
                    style={{
                        width: "100%",
                        backgroundColor: "#fff",
                        padding: '3px',
                        textAlign: 'center',
                        color: "#000",
                        fontSize: '18px',
                        position: 'sticky'
                    }}
                >
                    {currentTime.toLocaleDateString('th-TH')} -
                    {currentTime.toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                    })}
                </div>
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
        </>

    );
}

export default Dashboard;