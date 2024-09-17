
import { Button, DatePicker } from 'antd';
import thTH from 'antd/es/locale/th_TH'; // ใช้ locale ภาษาไทย
import dayjs from 'dayjs';
import './report.css'
import { useState } from 'react';
import ContentPdf from './ContentPdf';


function ReportSales() {

    const defaultValue = dayjs()
    const onChangeDate = (_, dateStr) => {
        console.log('current', defaultValue)
        console.log('date', dateStr)
    }


    return (
        <div className='bgreport'>
            <div className='contentReport'>

                <div className='topContent'>
                    Report Sales
                </div>
                <div className='centerContent'>
                    <div className='centerBox'>
                        <div className='boxCalendar'>
                            <DatePicker
                                defaultValue={defaultValue}
                                locale={thTH}
                                onChange={onChangeDate} />
                            <p>
                                To
                            </p>
                            <DatePicker
                                defaultValue={defaultValue}
                                locale={thTH}
                                onChange={onChangeDate} />
                        </div>

                        <Button
                            type='primary'
                        // onClick={() => {
                        // }}
                        >
                            Print Report
                        </Button>
                    </div>

                </div>
                <div className='bottomContent'>
                    <div className='boxContent'>
                     <ContentPdf/>


                    </div>
                </div>
            </div>

        </div>

    )
}

export default ReportSales