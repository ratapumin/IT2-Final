import React from "react";
import logo from "../img/logo-kathong.png";
// import { useJwt } from "react-jwt";
import axios from "axios";
import './Login.css';
import { useEffect, useState } from "react";

var jwt = localStorage.getItem("jwt");
if (jwt != null) {
  window.location.href = '../App.js'
}


function Login() {
  const [error, setError] = useState(null);
  const [user, setUser] = useState([]);
  const [user_verify, setUser_verify] = useState({ user_id: '', password: '' });

  useEffect(() => {
    axios.get(
      "http://localhost:1337/api/user-accounts").then(({ data }) => setUser(data.data)).catch((error) => setError(error));
  }, []);
  if (error) {
    return <> <p>can not user</p></>
  }
  console.log(user);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser_verify({ ...user_verify, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Authenticate user and obtain JWT token
      const response = await axios.post("http://localhost:1337/api/auth/local", user_verify);
      const jwtToken = response.data.jwt;

      // Example: Fetch user details from another endpoint (replace with your actual endpoint)
      const userDetailsResponse = await axios.get("http://localhost:1337/api/user-accounts", {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });

      console.log(userDetailsResponse.data); // Handle user details response as needed
      // Redirect or perform other actions upon successful login
      window.location.href = '../App.js';
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <>
      <div className="content">
        <div className="box">
          <div className="box-logo">
            <img src={logo} alt="logo" className="logo" />
          </div>
          <form className="form" onClick={handleSubmit}>
            <label>UserId:</label>
            <input type="text" className="input-box" name="user_id" value={user_verify.user_id} onChange={handleInput} required />
            <label>Password:</label>
            <input type="password" className="input-box" name="password" value={user_verify.password} onChange={handleInput} required />
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



// axios.get("http://localhost:1337/api/user-accounts").then((response) => {
//   console.log(response);
//   window.alert(response.data);
// });
//   <ul>{user.map(({ id, attributes }) => (
//   <li key={id}>{attributes.user_fname}
//     <li key={id}>
//       {attributes.user_lname}
//     </li>
//   </li>

// ))}</ul> 