import { Button, DatePicker } from 'antd';
import thTH from 'antd/es/locale/th_TH'; // ใช้ locale ภาษาไทย
import dayjs from 'dayjs';
import './report.css';
import ContentPdf from './ContentPdf';
import { useState } from 'react';
import axios from "axios";

const { RangePicker } = DatePicker; // Import RangePicker จาก DatePicker

function ReportSales() {
    const [date, setDate] = useState({
        start: dayjs().format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD'),
    }); // กำหนดค่าเริ่มต้นเป็นวันที่ปัจจุบัน
    const [statusPrint, setStatusPrint] = useState('no')
    const [printState, setPrintState] = useState('no')
    const [productList, setProductList] = useState([])

    const onDateChange = (_, dateStr) => {
        if (dateStr && dateStr[0] && dateStr[1]) {
            setDate({ start: dateStr[0], end: dateStr[1] }); // เก็บวันที่เริ่มต้นและสิ้นสุดใน state
            console.log("Selected Date Range:", dateStr);
        } else {
            setDate({ start: '', end: '' }); // ล้างค่าวันที่หากไม่มีการเลือก
            console.log(date)
        }
    };
    const handleonPrint = (value) => {
        setPrintState(value)
        console.log('prstat', printState)
        console.log('productLis aaaa', productList)
    }


    const handleProductList = (value) => {
        setProductList(value)
        console.log('productLis aaaa', productList)
    }


    const handlePrintReport = async () => {
        // if (printState === 'no') {

        //     setStatusPrint('no');
        // } else {
        // setStatusPrint('print');
        if (productList.length === 0) {
            setStatusPrint('no');
            setPrintState('no');
        } else {
            setStatusPrint('print');
            setPrintState('print');
            if (date && date.start && date.end) {
                try {
                    const res = await axios.post(
                        `http://localhost:5000/api/printReportsales/${date.start}/${date.end}`,
                        { statusPrint: 'print' } // ส่ง statusPrint เป็น 'print'
                    );

                    console.log("product", res.data);

                    console.log("prostatusPrintduct", statusPrint);
                    setStatusPrint('no');
                    setPrintState('no')
                } catch (error) {
                    console.log(error.response);
                    setStatusPrint('no');
                    setPrintState('no')
                }
            } else {
                console.log("No date range selected");
                setStatusPrint('no');
                setPrintState('no')
            }
        }

        // }

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
                        {/* <DownloadPdf date={date} /> */}
                        <Button type="primary"
                            onClick={() => handlePrintReport()}
                        >Print Report</Button>

                    </div>
                </div>
                <div className='bottomContent'>
                    <div className='boxContent'>
                        <ContentPdf date={date} statusPrint={statusPrint}
                            handleonPrint={handleonPrint}
                            products={handleProductList}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportSales;
