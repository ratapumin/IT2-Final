
import React, { useState } from 'react';
import { Button, DatePicker } from 'antd';
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

                        <Button type='primary' >
                            Print Report
                        </Button>
                    </div>

                </div>
                <div className='bottomContent'>
                    <div className='boxContent'>
                        box

                        <p>box content 1</p>
                        <p>box content 2</p>
                        <p>box content 3</p>
                        <p>box content 4</p>
                        <p>box content 5</p>
                        <p>box content 6</p>
                        <p>box content 7</p>
                        <p>box content 8</p>
                        <p>box content 9</p>
                        <p>box content 10</p>



                        <p>box content 1</p>
                        <p>box content 2</p>
                        <p>box content 3</p>
                        <p>box content 4</p>
                        <p>box content 5</p>
                        <p>box content 6</p>
                        <p>box content 7</p>
                        <p>box content 8</p>
                        <p>box content 9</p>
                        <p>box content 10</p>



                        <p>box content 1</p>
                        <p>box content 2</p>
                        <p>box content 3</p>
                        <p>box content 4</p>
                        <p>box content 5</p>
                        <p>box content 6</p>
                        <p>box content 7</p>
                        <p>box content 8</p>
                        <p>box content 9</p>
                        <p>box content 10</p>



                        <p>box content 1</p>
                        <p>box content 2</p>
                        <p>box content 3</p>
                        <p>box content 4</p>
                        <p>box content 5</p>
                        <p>box content 6</p>
                        <p>box content 7</p>
                        <p>box content 8</p>
                        <p>box content 9</p>
                        <p>box content 10</p>



                        <p>box content 1</p>
                        <p>box content 2</p>
                        <p>box content 3</p>
                        <p>box content 4</p>
                        <p>box content 5</p>
                        <p>box content 6</p>
                        <p>box content 7</p>
                        <p>box content 8</p>
                        <p>box content 9</p>
                        <p>box content 10</p>



                        <p>box content 1</p>
                        <p>box content 2</p>
                        <p>box content 3</p>
                        <p>box content 4</p>
                        <p>box content 5</p>
                        <p>box content 6</p>
                        <p>box content 7</p>
                        <p>box content 8</p>
                        <p>box content 9</p>
                        <p>box content 10</p>



                        <p>box content 1</p>
                        <p>box content 2</p>
                        <p>box content 3</p>
                        <p>box content 4</p>
                        <p>box content 5</p>
                        <p>box content 6</p>
                        <p>box content 7</p>
                        <p>box content 8</p>
                        <p>box content 9</p>
                        <p>box content 10</p>



                        <p>box content 1</p>
                        <p>box content 2</p>
                        <p>box content 3</p>
                        <p>box content 4</p>
                        <p>box content 5</p>
                        <p>box content 6</p>
                        <p>box content 7</p>
                        <p>box content 8</p>
                        <p>box content 9</p>
                        <p>box content 10</p>



                    </div>
                </div>
            </div>

        </div>

    )
}

export default ReportSales