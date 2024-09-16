
import React, { useState } from 'react';
import { DatePicker } from 'antd';
import thTH from 'antd/es/locale/th_TH'; // ใช้ locale ภาษาไทย
import dayjs from 'dayjs';
import './report.css'

function ReportSales() {
    const defaultValue = dayjs()
    const onChangeDate = (_, dateStr) => {
        console.log('current', defaultValue)
        console.log('date', dateStr)
    }
    return (
        <div>
            <p>
                Report Sales
            </p>
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


    )
}

export default ReportSales