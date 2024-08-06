import { useEffect, useState } from "react";

function Orders({ user, products }) {
  const [productCart, setProductCart] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) { // ตรวจสอบว่ามีสินค้าหรือไม่
      setProductCart(products); // ใช้ products ทั้งหมดแทนการเพิ่มครั้งละ 1
    }
  }, [products]);
console.log('carts pro',productCart)
  return (
    <section className="orders">
      <h1>New Orders</h1>
      {user && user.user_fname}

      <section className="order-box">
        {productCart.map((item, index) => (
          <div className="order-flex" key={item.p_id || index}>
            <p className="item-box">{item.p_name}</p>
            <p className="item-box-2">{item.p_price}</p>
            <p className="item-box-2">{item.quantity}</p>
          </div>
        ))}
      </section>
    </section>
  );
}

export default Orders;
