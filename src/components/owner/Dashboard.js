import React from 'react';
import { Flex, Card } from 'antd';
import './sidebar.css';
import SidebarDashboard from './SidebarDashboard'; // นำเข้าคอมโพเนนท์ SidebarDashboard

function Dashboard() {
    return (
        <div>

            <p className='solid'>
                <div
                    className='flexCard'
                >

                    <Card
                        className='solid'
                        title="Daily sales"
                        bordered={false}
                        style={{ width: 300, height: 200 }}
                    >
                        <p>2530</p>
                    </Card>



                    <Card
                        className='solid'
                        title="Monthly sales"
                        bordered={false}
                        style={{ width: 300, height: 200 }}
                    >
                        <p>2530</p>
                    </Card>


                    <Card
                        className='solid'
                        title="Annual sales"
                        bordered={false}
                        style={{ width: 300, height: 200 }}
                    >
                        <p>2530</p>
                    </Card>


                </div>
            </p>
        </div>
    );
}

export default Dashboard;
