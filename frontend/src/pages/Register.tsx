import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const onRegisterFinish = async (values: { username: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await authApi.register(values.username, values.password, values.email);
      const msg: string = res.data as unknown as string;
      
      if (msg === 'Username already exists') {
        message.error('Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.');
        return;
      }

      message.success('Mã OTP đã được gửi đến email của bạn! Vui lòng kiểm tra.');
      setRegisterData(values);
      setStep('otp');
    } catch (error: any) {
      if (!error?.response) {
        message.error('Không thể kết nối server. Hãy kiểm tra backend đang chạy!');
      } else {
        message.error(error?.response?.data || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onOtpFinish = async (values: { otp: string }) => {
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(registerData.email, values.otp);
      const msg: string = res.data as unknown as string;

      if (msg === 'OTP invalid') {
        message.error('Mã OTP không hợp lệ! Vui lòng thử lại.');
        return;
      }
      
      if (msg === 'No registration request found') {
        message.error('Không tìm thấy yêu cầu đăng ký. Vui lòng đăng ký lại.');
        setStep('register');
        return;
      }

      message.success('Đăng ký tài khoản thành công! 🎉');
      navigate('/login');
    } catch (error: any) {
      if (!error?.response) {
        message.error('Không thể kết nối server. Hãy kiểm tra backend đang chạy!');
      } else {
        message.error(error?.response?.data || 'Xác thực OTP thất bại. Vui lòng thử lại.');
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
        {step === 'register' ? (
          <>
            <h2 className="auth-title">Đăng ký tài khoản mới</h2>
            <Form name="register" onFinish={onRegisterFinish} layout="vertical" size="large" style={{ marginTop: 24 }}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
              >
                <Input placeholder="Nhập tên đăng nhập của bạn" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Địa chỉ email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input placeholder="Nhập địa chỉ email của bạn" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Xác nhận mật khẩu"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) return Promise.resolve();
                      return Promise.reject(new Error('Mật khẩu không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Xác nhận mật khẩu" />
              </Form.Item>

              <Form.Item style={{ marginBottom: 8 }}>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <>
            <h2 className="auth-title">Xác thực OTP</h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 24 }}>
              Mã OTP đã được gửi đến email <b>{registerData.email}</b>. Vui lòng nhập mã để kích hoạt tài khoản.
            </p>
            <Form name="otp" onFinish={onOtpFinish} layout="vertical" size="large">
              <Form.Item
                name="otp"
                label="Mã OTP"
                rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }]}
              >
                <Input placeholder="Nhập mã OTP gồm 6 số" maxLength={6} style={{ letterSpacing: 8, textAlign: 'center', fontSize: 20 }} />
              </Form.Item>

              <Form.Item style={{ marginBottom: 8 }}>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Xác minh & Kích hoạt
                </Button>
              </Form.Item>

              <Button type="link" block onClick={() => setStep('register')} style={{ color: 'var(--text-secondary)' }}>
                Quay lại thay đổi thông tin
              </Button>
            </Form>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Đã có tài khoản? </span>
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>
            Đăng nhập
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

export default Register;

