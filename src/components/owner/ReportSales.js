import { Button, DatePicker } from 'antd';
import thTH from 'antd/es/locale/th_TH'; // ใช้ locale ภาษาไทย
import dayjs from 'dayjs';
import './report.css';
import ContentPdf from './ContentPdf';
import { useState } from 'react';
import DownloadPdf from './DownloadPdf';

const { RangePicker } = DatePicker; // Import RangePicker จาก DatePicker

function ReportSales() {
    const [date, setDate] = useState({
        start: dayjs().format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD')
    }); // กำหนดค่าเริ่มต้นเป็นวันที่ปัจจุบัน

    const onDateChange = (_, dateStr) => {
        if (dateStr && dateStr[0] && dateStr[1]) {
            setDate({ start: dateStr[0], end: dateStr[1] }); // เก็บวันที่เริ่มต้นและสิ้นสุดใน state
            console.log("Selected Date Range:", dateStr);
        } else {
            setDate({ start: '', end: '' }); // ล้างค่าวันที่หากไม่มีการเลือก
        }
    };

    return (
        <div className='bgreport'>
            <div className='contentReport'>
                <div className='topContent'>
                    Report Sales
                </div>
                <div className='centerContent'>
                    <div className='centerBox'>
                        <div className='boxCalendar'>
                            <RangePicker
                                defaultValue={[dayjs(), dayjs()]} // กำหนดค่าเริ่มต้นเป็นวันที่ปัจจุบัน
                                locale={thTH} // กำหนด locale เป็นภาษาไทย
                                onChange={onDateChange} // เรียกฟังก์ชันเมื่อวันที่เปลี่ยน
                            />
                        </div>
                            <DownloadPdf date={date} />

                    </div>
                </div>
                <div className='bottomContent'>
                    <div className='boxContent'>
                        <ContentPdf date={date} />

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportSales;
