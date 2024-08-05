// import React from 'react';
import axios from "axios";
import { useState, useEffect } from "react";

export const PageAbout = ({selectedCategory, onCategoryClick }) => {
  const [productType, setProductType] = useState()

  useEffect(() => {
    const fetchProductType = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        // ใช้ Set เพื่อลบประเภทสินค้าที่ซ้ำกัน
        const uniqueTypes = Array.from(new Set(res.data.map(item => item.p_type)));
        setProductType(uniqueTypes);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProductType();
  }, []);


  return (


    <section className="menu-drink">
      {productType && productType.map((type) => (
        <div
          key={type}
          className="drink-type"
          style={{
            backgroundColor: selectedCategory === type ? '#FFE8A3' : 'initial',
            border: `solid ${selectedCategory === type ? '#FFCD2B' : 'transparent'}`
          }}
          onClick={() => onCategoryClick(type)}
        >
          <h1>{type}</h1>
        </div>
      ))}

    </section>
  );
}
export default PageAbout;
