import { useEffect, useState } from "react";

function Orders({ user, products }) {
  const [productCart, setProductCart] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setProductCart(products);
    }
  }, [products]);

  return (
    <section className="orders">
      <div className="content-order">
        <h1>New Orders</h1>
        {user && user.user_fname}

        <section className="bg-order">
          <section className="order-box">
            {productCart.map((item, index) => (
              <div className="order-flex" key={item.p_id || index}>
                <p className="item-box">{item.p_name}</p>
                <p className="item-box-2">{item.p_price}</p>
                <p className="item-box-2">{item.quantity}</p>
              </div>
            ))}
          </section>

          <section className="subtotal">
            <p>Subtotal</p>
            <p>0</p>
          </section>
          <section className="total">
            <p>Total</p>
            <p>0</p>
          </section>
          <section className="cash">
            <p>Cash</p>
            <p>0</p>
          </section>
          <section className="change">
            <p>Change</p>
            <p>0</p>
          </section>
        </section>
      </div>
      <section className="order-bottom">



        <section className="delete">
          <p>DELETE</p>
        </section>
        <section className="delete-all">
          <p>DELETE ALL</p>
        </section>
        <section className='cashh'>
          <p>CASH</p>
        </section>
      </section>





    </section>
  );
}

export default Orders;
