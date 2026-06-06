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

      // Phân tích quyền (role) từ JWT token
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);

      const role = payload.role || 'USER';
      localStorage.setItem('token', token);
      localStorage.setItem('username', values.username);
      localStorage.setItem('role', role);

      message.success('Đăng nhập thành công! 👋');
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      if (error?.status === 401 || error?.status === 400) {
        message.error('Tên đăng nhập hoặc mật khẩu không đúng!');
      } else if (!error?.status) {
        message.error('Không thể kết nối server. Kiểm tra backend đang chạy!');
      } else {
        message.error('Có lỗi xảy ra: ' + (error?.error || error?.statusText || ''));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Phần Đầu Trang (Header) */}
      <div className="auth-header">
        <div className="auth-header-logo" onClick={() => navigate('/')}>
          Booking<span style={{ color: '#febb02' }}>.com</span>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-box" style={{ padding: '40px 32px' }}>
          <h1 className="auth-title" style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>Đăng nhập</h1>
          <p className="auth-subtitle" style={{ fontSize: 15, color: '#595959', marginBottom: 24 }}>Chào mừng bạn quay lại Booking.com</p>

          <Form name="login" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="username"
              label={<span style={{ fontWeight: 600 }}>Tên đăng nhập</span>}
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#929292' }} />}
                placeholder="Nhập tên đăng nhập"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span style={{ fontWeight: 600 }}>Mật khẩu</span>}
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#929292' }} />}
                placeholder="Nhập mật khẩu"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginBottom: 16, marginTop: -8 }}>
              <Link to="/forgot-password" style={{ fontSize: 13, color: '#006ce4' }}>
                Quên mật khẩu?
              </Link>
            </div>

            <Form.Item style={{ marginTop: 12 }}>
              <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 44, fontSize: 15, fontWeight: 700, borderRadius: 8, background: '#006ce4' }}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <Divider plain style={{ color: '#8c8c8c', fontSize: 13, margin: '24px 0' }}>hoặc</Divider>

          <div style={{ textAlign: 'center', fontSize: 14 }}>
            <span style={{ color: '#595959' }}>Chưa có tài khoản? </span>
            <Link to="/register" style={{ color: '#006ce4', fontWeight: 700, marginLeft: 4 }}>
              Đăng ký miễn phí
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#929292', lineHeight: 1.5 }}>
          Bằng cách đăng nhập, bạn đồng ý với{' '}
          <Link to="/privacy" style={{ color: '#006ce4', fontWeight: 500 }}>Điều khoản sử dụng</Link>{' '}và{' '}
          <Link to="/privacy" style={{ color: '#006ce4', fontWeight: 500 }}>Chính sách bảo mật</Link> của chúng tôi.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
