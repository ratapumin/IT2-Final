import "./App.css";
import logo from "./img/logo-kathong.png";
// import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="content">
        <div className="box">
          <h1 className="">WELCOME TO KATHONG COFFEE SHOP</h1>
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
          <p>
            {/* <Link to="D:\Project\project\my-react-app\src\Login.jsx">
              {" "}
              Link
            </Link> */}
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
