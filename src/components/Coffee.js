import React from "react";
import './Coffee.css';
function Coffee() {
  return <>
    <div className="grid">
      <div className="content-order contenttt ">
        <p>New Order</p>
      </div>

      <div className="type-menu contenttt">
        <div className="contain">
          <p className="card">COF</p>
          <p className="card">TEA</p>
          <p className="card">CHOC</p>
          <p className="card">SODA</p>
          <p className="card">ANOTHER</p>
        </div>
      </div>

      <div className="ice-hot  contenttt">
        <div className="contain">
          <p className="card"> ICE</p>
          <p className="card"> HOT</p>
        </div>  </div>

      <div className="main-content contenttt ">
        <div className="contain">
          <p className="card">Americano</p>
          <p className="card">Americano Honey</p>
          <p className="card">Americano Honey Lemon</p>
          <p className="card">Espesso</p>
        </div>
      </div>

    </div>

  </>;
}

export default Coffee;