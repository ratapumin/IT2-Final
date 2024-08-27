import axios from "axios";
import { useEffect, useState } from "react";
import { types } from './DrinkType';

function ProductList({ selectedType, selectedCategory, onProductSelect }) {
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        // console.log("Fetching products with:", selectedType, selectedCategory);

        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                const filterProductList = res.data.filter((product) =>
                    (product.p_type === selectedType &&
                        (product.category === 'ICE' || product.category === 'HOT')) &&
                    product.category.includes(selectedCategory)
                );
                // console.log("Filtered products:", filterProductList);
                setProductList(filterProductList);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [selectedType, selectedCategory]);

    const handleFindProduct = (id) => {
        const selectedProduct = productList.find(product => product.p_id === id);
        if (selectedProduct) {
            // console.log("Selected product:", selectedProduct);
            onProductSelect(selectedProduct);
      
        }
    };

    const selectedTypeColor = types.find(type => type.name === selectedType)?.color || '#FFFFFF';

    return (
        <section className="product-section">
            {productList.length > 0 ? (
                productList.map((product) => (
                    <div className="product-flex" key={product.p_id}>
                        <button
                            className="product-box"
                            onClick={() => handleFindProduct(product.p_id)}
                            style={{ backgroundColor: selectedTypeColor }}
                        >
                            {product.p_name}
                        </button>
                    </div>
                ))
            ) : (
                <p>No products available</p>
            )}
        </section>
    );
}

export default ProductList;
