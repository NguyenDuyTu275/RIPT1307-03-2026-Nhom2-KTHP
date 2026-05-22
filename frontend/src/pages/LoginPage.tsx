import React, { useState } from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { authApi } from '../api';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await authApi.login(values.username, values.password);
      const token: string = res.data as unknown as string;
      localStorage.setItem('token', token);
      localStorage.setItem('username', values.username);
      message.success('Đăng nhập thành công! 👋');
      navigate('/');
    } catch (error: any) {
      if (!error?.response) {
        message.error('Không thể kết nối server. Kiểm tra backend đang chạy!');
      } else {
        message.error('Tên đăng nhập hoặc mật khẩu không đúng!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Header */}
      <div className="auth-header">
        <div className="auth-header-logo" onClick={() => navigate('/')}>
          Booking.com
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">Đăng nhập</h1>
          <p className="auth-subtitle">Chào mừng bạn quay lại Booking.com</p>

          <Form name="login" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#929292' }} />}
                placeholder="Nhập tên đăng nhập"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#929292' }} />}
                placeholder="Nhập mật khẩu"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginBottom: 16, marginTop: -8 }}>
              <Link to="/forgot-password" style={{ fontSize: 13, color: '#006ce4' }}>
                Quên mật khẩu?
              </Link>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 44, fontSize: 15, fontWeight: 700 }}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <Divider plain style={{ color: '#929292', fontSize: 13 }}>hoặc</Divider>

          <div style={{ textAlign: 'center', fontSize: 14 }}>
            <span style={{ color: '#595959' }}>Chưa có tài khoản? </span>
            <Link to="/register" style={{ color: '#006ce4', fontWeight: 700 }}>
              Đăng ký miễn phí
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#929292' }}>
          Bằng cách đăng nhập, bạn đồng ý với{' '}
          <Link to="/privacy" style={{ color: '#006ce4' }}>Điều khoản sử dụng</Link>{' '}và{' '}
          <Link to="/privacy" style={{ color: '#006ce4' }}>Chính sách bảo mật</Link> của chúng tôi.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
