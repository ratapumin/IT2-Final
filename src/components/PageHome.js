import React from 'react';

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

    {/* {productType && productType.map((type) => (
      <section key={type.p_type}>
        <h1>{type.p_type}</h1>
      </section>
    ))} */}


<h1>home page</h1>
  </>)

}

export default PageHome;
