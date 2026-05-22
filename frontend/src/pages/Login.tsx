import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const u = values.username?.trim().toLowerCase();
      const p = values.password?.trim();
      if (u === 'admin' && p === 'admin') {
        localStorage.setItem('token', 'mock_admin_token');
        localStorage.setItem('username', 'admin');
        message.success('Đăng nhập bằng tài khoản cố định (admin/admin)!');
        setLoading(false);
        navigate('/welcome');
        return;
      }
      const res = await authApi.login(values.username, values.password);
      const token = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', values.username);
      message.success('Đăng nhập thành công!');
      navigate('/welcome');
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 500 || status === 401) {
        message.error('Sai tên đăng nhập hoặc mật khẩu!');
      } else if (status === 0 || !error?.response) {
        message.error('Không thể kết nối server. Hãy kiểm tra backend đang chạy!');
      } else {
        message.error(error?.response?.data || 'Đăng nhập thất bại!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ background: 'var(--header-bg)', padding: '16px 15%' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0, cursor: 'pointer' }} onClick={() => navigate('/welcome')}>Booking.com</h1>
      </div>
      <div className="auth-container">
        <h2 className="auth-title">Đăng nhập hoặc tạo tài khoản</h2>
        <p className="auth-subtitle" style={{ color: 'var(--text-primary)', marginTop: 8 }}>
          Bạn có thể đăng nhập tài khoản Booking.com của mình để truy cập các dịch vụ của chúng tôi.
        </p>

        <Form name="login" onFinish={onFinish} layout="vertical" size="large" style={{ marginTop: 24 }}>
          <Form.Item
            name="username"
            label="Tên đăng nhập / Email"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input placeholder="Nhập tên đăng nhập của bạn" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Tiếp tục
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Chưa có tài khoản? </span>
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>
            Đăng ký ngay
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: 40, fontSize: 12, color: 'var(--text-secondary)' }}>
          Qua việc đăng nhập hoặc tạo tài khoản, bạn đồng ý với các Điều khoản và Điều kiện cũng như Chính sách An toàn và Bảo mật của chúng tôi
          <br /><br />
          Bảo lưu mọi quyền.<br />
          Bản quyền (2006 - 2026) - Booking.com™
        </div>
      </div>
    </div>
  );
};

export default Login;
