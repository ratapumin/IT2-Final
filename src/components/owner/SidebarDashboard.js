import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, FileTextOutlined, TeamOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './sidebar.css';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

function SidebarDashboard() {
    const navigate = useNavigate();

    const menuItems = [
        {
            key: '1',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate("/dashboard")
        },
        {
            key: '2',
            icon: <FileTextOutlined />,
            label: 'Report Sale',
            onClick: () => navigate("/report-sale")
        },
        {
            key: '3',
            icon: <TeamOutlined />,
            label: 'Employee',
            onClick: () => navigate("/employee")
        },
        {
            key: '4',
            icon: <ArrowLeftOutlined />,
            label: 'Back',
            onClick: () => navigate("/orders")
        }
    ];

    return (
        <Sider className="sidebardashboard">
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{ height: '100%', borderRight: 0 }}
                items={menuItems}
            />
        </Sider>
    );
}

export default SidebarDashboard;
