import { Form, Input, Button, notification, message, Spin } from 'antd';
import Logo from '../img/logo-kathong.png';
import './Login.css';
import axios from 'axios';
import { useEffect, useState } from "react";
import { useUser } from './user/UserContext';

function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useUser();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      // handle token logic
    }
  }, []);

  const handleLogin = async (values) => {
    const hideLoadingMessage = message.loading('Logging in...', 0); // แสดงข้อความการหมุนแบบไม่หมดเวลา

    try {
      console.log('Attempting login with:', values);
      const res = await axios.post('http://localhost:5000/api/users/login', {
        user_id: values.userId,
        user_password: values.password
      });

      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem('jwt', res.data.token);

      hideLoadingMessage(); // ซ่อนข้อความหมุนเมื่อการร้องขอสำเร็จ

      notification.success({
        message: 'Login Successfully',
        description: (
          <div>
            <Spin /> {/* แสดงการหมุนใน notification */}
            <span> Welcome </span>
          </div>
        ),
        placement: 'topRight',
        duration: 2,
      });

      setTimeout(() => {
        window.location.href = '/protected';
      }, 2000);

    } catch (error) {
      hideLoadingMessage(); // ซ่อนข้อความหมุนเมื่อเกิดข้อผิดพลาด

      notification.error({
        message: 'Error',
        description: 'Login failed, please try again.',
        placement: 'topRight',
        duration: 2,
      });
      console.error('Login failed', error);
    }
  };

  return (
    <div className='contentLogin'>
      <div className='leftContent'>
        <img src={Logo} alt="logo" />
      </div>
      <div className='rightContent'>
        <Form
          className="form"
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            label="User Id"
            name="userId"
            style={{ width: '340px' }}
            rules={[{ required: true, message: 'Please enter your User ID!' }]}
          >
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            style={{ width: '340px' }}
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              style={{ width: '80px' }} 
              htmlType="submit" 
              block 
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
