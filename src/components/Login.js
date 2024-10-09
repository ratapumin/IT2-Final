import { Form, Input, Button, notification, message, Spin } from 'antd';
import Logo from '../img/bg.png';
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
      <div className='bg'>
        <img src={Logo} alt="logo" />
        <div className='rightContent'>
          <Form onFinish={handleLogin}>
            <Form.Item
              name="userId"
              style={{ width: '350px' }}
              rules={[{ required: true, message: 'Please input your User ID!' }]}
            >
              <Input className="custom-input" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
            </Form.Item>
            <Form.Item
              name="password"
              style={{ width: '350px' }}
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password className="custom-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className='btnLogin'
              >
                Login
              </Button>
            </Form.Item>
          </Form>

        </div>
      </div>
    </div>
  );
}

export default Login;
