import { useEffect, useState } from "react"
import axios from "axios";


function DrinkType({ selectedCategory, onCategoryClick }) {
    // const [productType, setProductType] = useState()

    // useEffect(() => {
    //     const fetchProductType = async () => {
    //         try {
    //             const res = await axios.get('http://localhost:5000/api/products');
    //             // ใช้ Set เพื่อลบประเภทสินค้าที่ซ้ำกัน
    //             const uniqueTypes = Array.from(new Set(res.data.map(item => item.p_type)));
    //             setProductType(uniqueTypes);
    //         } catch (error) {
    //             console.error('Error fetching products:', error);
    //         }
    //     };
    //     fetchProductType();
    // }, []);

    const types = ['Coffee', 'Tea', 'Choc', 'Another'];



    return (
        <div className="menu-drink">
            {types.map(type => (
                <h2
                    key={type}
                    className="drink-type"
                    style={{
                        backgroundColor: selectedCategory === type ? '#FFE8A3' : 'initial',
                        border: `solid ${selectedCategory === type ? '#FFCD2B' : 'transparent'}`
                    }}
                    onClick={() => onCategoryClick(type)}
                >
                    {type}
                </h2>
            ))}
        </div>
    );

}
export default DrinkType