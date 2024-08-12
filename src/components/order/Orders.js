import { useEffect, useState, useRef } from "react";

function Orders({ user, products, onUpdateCart, onDeleteAll }) {
  const [productCart, setProductCart] = useState([]);
  const [selected, setSelected] = useState()
  const orderBoxRef = useRef(null)

  useEffect(() => {
    if (products && products.length > 0) {
      setProductCart(products);
    }
  }, [products]);


  useEffect(() => {
    // เลื่อน scrollbar ไปที่ตำแหน่งล่างสุดเมื่อมีการเพิ่มสินค้าใหม่
    if (orderBoxRef.current) {
      orderBoxRef.current.scrollTop = orderBoxRef.current.scrollHeight;
    }
  }, [productCart]); // ทำการเลื่อน scrollbar ทุกครั้งที่ productCart เปลี่ยนแปลง

  const handleSelected = (id) => {
    setSelected(id)
  }

  const handleDeleted = (selected) => {
    const updatedCart = productCart.filter(product => product.p_id !== selected);
    setProductCart(updatedCart);
    setSelected(null);
    onUpdateCart(updatedCart);
  }



  return (
    <section className="orders">
      <div className="content-order">
        <h1>New Orders</h1>
        {user && user.user_fname}

        <section className="bg-order">
          <section className="order-box" ref={orderBoxRef}>
            {productCart.map((item, index) => (
              <div
                className={`order-flex ${selected === item.p_id ? 'selected' : ''}`} // เพิ่ม class 'selected' ถ้ารายการนี้ถูกเลือก
                onClick={() => handleSelected(item.p_id)}
                key={item.p_id || index}>
                <p className="item-box">{item.p_name}</p>
                <p className="item-box">{item.p_price}</p>
                <p className="item-box">{item.quantity}</p>
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



        <button
          className="delete"
          onClick={() => handleDeleted(selected)}
        > DELETE
        </button>

        <button
          className="delete-all"
          onClick={() => {
            setProductCart([])
            onDeleteAll([])
          }}
        >
          DELETE ALL
        </button>

        <button className='cashh'>CASH</button>
      </section>
    </section >
  );
}

export default Orders;