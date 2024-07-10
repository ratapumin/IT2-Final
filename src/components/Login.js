import logo from "../img/logo-kathong.png";
import './Login.css';
import axios from 'axios';
import { useState } from "react";
import swal from 'sweetalert';


function Login() {

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('')


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { user_id: userId, user_password: password });
      const res = await axios.post('http://localhost:3000/login', {
        user_id: userId,
        user_password: password
      }, {
        headers: {
        }
      })
      console.log('Login response:', res.data);
      localStorage.setItem('jwt', res.data.token)
      swal({
        title: "Login Successfuly ",
        text: `Welcome ${res.data.user_fname}`,
        icon: "success",
        button: false,
        timer: 1200,
      }).then(() => {
        window.location.href = '/protected';
      })
    } catch (error) {
      swal({
        title: "Error",
        text: "Login failed please try aging.",
        icon: "error",
        button: false,
        timer: 1000
      })
      console.error('Login failed', error)
    }
  }



  return (
    <>
      <div className="content">
        <div className="box">
          <div className="box-logo">
            <img src={logo} alt="logo" className="logo" />
          </div>
          <form className="form" onSubmit={handleLogin}>
            <label>UserId:</label>
            <input
              type="text"
              className="input-box"
              name="user_id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required />
            <label>Password:</label>
            <input
              type="password"
              className="input-box"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
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


