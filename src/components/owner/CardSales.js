import { Card } from 'antd';
import React from 'react';


function CardSales() {


    return (

        <>
            <Card
                className='solid'
                title="Daily sales"
                bordered={false}
                style={{ width: 300, height: 150 }}
            >
                <p>2530</p>
            </Card>
            <Card
                className='solid'
                title="Monthly sales"
                bordered={false}
                style={{ width: 300, height: 150 }}
            >
                <p>2530</p>
            </Card>
            <Card
                className='solid'
                title="Annual sales"
                bordered={false}
                style={{ width: 300, height: 150 }}
            >
                <p>2530</p>
            </Card>
        </>


    )
}

export default CardSales