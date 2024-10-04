import React from 'react';
import PrintReceipt from './order/cash/PrintReceipt';

const PageHome = () => {
  const [productType, setProductType] = useState()

  useEffect(() => {

    const fetchProductType = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const filteredType = res.data.filter(type => type.p_type.length)
        setProductType(filteredType);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProductType()
  }, [])

  return (<>

    <PrintReceipt />


    <h1>home page</h1>
  </>)

}

export default PageHome;
