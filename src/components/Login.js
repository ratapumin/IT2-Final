import Logo from '../img/logo-kathong.png'
import './Login.css';
import axios from 'axios';
import { useEffect, useState } from "react";
import swal from 'sweetalert';
import { useUser } from './user/UserContext';


function Login() {

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('')
  const { user, setUser } = useUser()



  useEffect(() => {
    const token = localStorage.getItem('jwt')
    if (token) {
    }
  }, [])


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { user_id: userId, user_password: password });
      const res = await axios.post('http://localhost:5000/api/users/login', {
        user_id: userId,
        user_password: password
      })
      // console.log(userId, password)
      const userData = res.data.user
      setUser(userData)
      localStorage.setItem('jwt', res.data.token)
      // const userRole = userData.role_type
      // ${userData.user_fname}
      swal({
        title: "Login Successfuly ",
        text: `Welcome`,
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
      {/* <div className="content">
        <div className="box">
          <div className="box-logo">
            <img src={Logo} alt="logo" className="logo" />
          </div>
          <form className="form" onSubmit={handleLogin}>
            <label>User Id:</label>
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
      </div> */}
      <div className='contentLogin'>
        <div
          className='leftContent'
        >    <img src={Logo} alt="logo"/></div>
        <div>login page</div>
      </div>

    </>
  );
}

export default Login;


