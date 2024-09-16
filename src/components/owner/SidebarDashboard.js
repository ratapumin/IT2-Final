import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, FileTextOutlined, TeamOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

function SidebarDashboard() {
    const navigate = useNavigate();
    const location = useLocation(); // ใช้ตรวจสอบ path ปัจจุบัน

    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate("/dashboard")
        },
        {
            key: '/report',
            icon: <FileTextOutlined />,
            label: 'Report Sale',
            onClick: () => navigate("/report")
        },
        {
            key: '/employee',
            icon: <TeamOutlined />,
            label: 'Employee',
            onClick: () => navigate("/employee")
        },
        {
            key: '/orders',
            icon: <ArrowLeftOutlined />,
            label: 'Back',
            onClick: () => navigate("/orders")
        }
    ];

    return (
        <Sider className="sidebardashboard">
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]} // ใช้ location.pathname เพื่อตั้งเมนูที่ active
                style={{ height: '100%', borderRight: 0 }}
                items={menuItems}
            />
        </Sider>
    );
}

export default SidebarDashboard;
