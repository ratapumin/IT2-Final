
function DrinkType({ selectedType, onTypeClick }) {
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
                        backgroundColor: selectedType === type ? '#FFE8A3' : 'initial',
                        border: `solid ${selectedType === type ? '#FFCD2B' : 'transparent'}`
                    }}
                    onClick={() => onTypeClick(type)}
                >
                    {type}
                </h2>
            ))}
        </div>
    );

}
export default DrinkType