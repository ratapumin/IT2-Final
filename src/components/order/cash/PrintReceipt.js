import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'

const PrintReceipt = () => {

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const createReceipt = async () => {
    const items = [
      { name: 'สินค้า A', price: 100 },
      { name: 'สินค้า B', price: 200 },
    ];
    const total = 300;
    try {
      const res = await axios.post('http://localhost:5000/api/createreceipt', items, total)
      if (res.ok) {
        console.log('ใบเสร็จพิมพ์เรียบร้อย');
      } else {
        console.error('เกิดข้อผิดพลาดในการพิมพ์ใบเสร็จ');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเชื่อมต่อ:', error);
    }


  }
  useEffect(() => {
    createReceipt()
  }, [createReceipt]);

  return (
    <div>PrintReceipt</div>
  )
}

export default PrintReceipt