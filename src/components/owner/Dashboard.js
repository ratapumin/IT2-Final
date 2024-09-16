import React from 'react';
import './dashboard.css';
import CardSales from './CardSales';
import PopularChart from './PopularChart';
import SalesChart from './SalesChart';




function Dashboard() {


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