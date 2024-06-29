import React from "react";
function Login() {
  return (
    <>
      <div className="content">
        <div className="box">
          <h1>WELCOME TO KATHONG COFFEE SHOP</h1>
          <div className="box-logo">
            <img src={logo} alt="logo" className="logo" />
          </div>
          <form className="form">
            <label>UserId:</label>
            <input type="text" className="input-box" />
            <label>Password:</label>
            <input type="password" className="input-box" />
            <div className="button-container">
              <button type="submit" className="center-button">
                Login
              </button>
            </div>
          </form>
          <p></p>
        </div>
      </div>
    </>
  );
}

export default Login;
