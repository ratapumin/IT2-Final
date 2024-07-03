import React from "react";
import './Coffee.css';
function Coffee() {
  return <>
    <div className="container">
      <div className="grid">
        <div className="content-order  ">
          <p>New Order</p>
        </div>

        <div className="type-menu ">
          <div className="content-box">
            <p>COF</p>
            <p>TEA</p>
            <p>CHOC</p>
            <p>SODA</p>
            <p>ANOTHER</p>
          </div>

          <div className="ice-hot  ">
            <div className="content-box">
              <p> ICE</p>
              <p> HOT</p>
            </div>
          </div>

          <div className="main-content ">
            <div className="left-content">
                <p className="item">Americano</p>
                <p className="item">Americano Honey</p>
                <p className="item">Americano Honey Lemon</p>
                <p className="item">Espesso</p>
                <p className="item">Americano</p>
                <p className="item">Americano Honey</p>
                <p className="item">Americano Honey Lemon</p>
                <p className="item">Espesso</p>
                <p className="item">Americano</p>
                <p className="item">Americano Honey</p>
                <p className="item">Americano Honey Lemon</p>
                <p className="item">Espesso</p>
           
            </div>
          </div>

        </div>

      </div>
    </div>
  </>;
}

export default Coffee;