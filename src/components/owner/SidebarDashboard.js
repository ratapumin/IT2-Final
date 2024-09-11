
import React from 'react';
import { Col, Row } from 'antd';
import { Flex, Radio } from 'antd';
import './sidebar.css'
import Button from 'antd-button-color';
function SidebarDashboard() {
    return (
        <div
            className='sidebardashboard'
        >
            <Flex gap="middle" vertical>

                <Button ghost >
                    Report Sales
                </Button>
                <Button ghost >
                    Employee
                </Button>

                <Button ghost >
                    Back
                </Button>

            </Flex>
        </div>
    )
}

export default SidebarDashboard