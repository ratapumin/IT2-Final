import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogoutOutlined, AppstoreAddOutlined, UserOutlined } from '@ant-design/icons'; // นำเข้าไอคอนที่ต้องการ
import { useLogout } from '../components/Logout'; // นำเข้าฟังก์ชัน useLogout
import './Sidebar.css'; // อย่าลืมปรับ CSS ถ้าจำเป็น
import { icons } from 'antd/es/image/PreviewGroup';
import { width } from '@mui/system';

const { Sider } = Layout;

function Sidebar() {
    const handleLogout = useLogout(); // ใช้ custom hook
    const location = useLocation(); // ใช้ตรวจสอบ path ปัจจุบัน
    const navigate = useNavigate();

    const menuItems = [
        {
            key: '/kathong',
            label: (
                <span style={{ fontWeight: 'bold', fontSize: '20px' ,textAlign:'center'}}>KATHONG POS</span> 
            )
        },
        {
            key: '/products',
            label: 'Products',
            icon: <AppstoreAddOutlined />,
            onClick: () => navigate("/products")
        },
        {
            key: '/owners',
            icon: <UserOutlined />,
            label: 'Owners',
            onClick: () => navigate("/owners")
        },
        {
            key: 'logout', // ใช้ key ที่ไม่ตรงกับ link เพื่อทำให้มันไม่ active
            label: (
                <span onClick={handleLogout} style={{ color: 'red' }}>
                    <LogoutOutlined /> Sign Out
                </span>
            ),
        },
    ];

    return (
        <Sider className="sidebar" style={{ height: '100vh' }}> {/* ทำให้ Sidebar สูง 100% */}
            {/* <h3 style={{ color: 'black', textAlign: 'center', margin: '16px 0', }}>Kathong POS</h3> */}
            <Menu
                className="sidebar"
                theme='dark'
                mode="inline"
                selectedKeys={[location.pathname]} // ใช้ location.pathname เพื่อตั้งเมนูที่ active
                style={{ height: '100%', borderRight: 0 }}
                items={menuItems}
            />
        </Sider>
    );
}

export default Sidebar;
