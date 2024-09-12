import React from 'react';
import './dashboard.css';
import CardSales from './CardSales';
import PopularChart from './PopularChart';
import SalesChart from './SalesChart';




function Dashboard() {


    return (
        <div>
            <p>welcome Owner</p>
            <div className='solid'>

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