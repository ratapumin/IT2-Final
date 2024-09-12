import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, FileTextOutlined, TeamOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './sidebar.css';

const { Sider } = Layout;

function SidebarDashboard() {
    return (
        <Sider
            // width={200}
            className="sidebardashboard"
        >
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{ height: '100%', borderRight: 0 }}
            >
                <Menu.Item key="1" icon={<DashboardOutlined />}>
                    Dashboard
                </Menu.Item>
                <Menu.Item key="2" icon={<FileTextOutlined />}>
                    Report Sale
                </Menu.Item>
                <Menu.Item key="3" icon={<TeamOutlined />}>
                    Employee
                </Menu.Item>
                <Menu.Item key="4" icon={<ArrowLeftOutlined />}>
                    Back
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

export default SidebarDashboard;
