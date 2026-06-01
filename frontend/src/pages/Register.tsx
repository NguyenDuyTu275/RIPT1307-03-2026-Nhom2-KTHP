import React, { useState } from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
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
      if (!error?.status) {
        message.error('Không thể kết nối server. Hãy kiểm tra backend đang chạy!');
      } else {
        message.error(error?.error || 'Thao tác thất bại. Vui lòng thử lại.');
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
      if (!error?.status) {
        message.error('Không thể kết nối server. Hãy kiểm tra backend đang chạy!');
      } else {
        message.error(error?.error || 'Xác thực OTP thất bại. Vui lòng thử lại.');
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
          {step === 'register' ? (
            <>
              <h1 className="auth-title">Đăng ký tài khoản</h1>
              <p className="auth-subtitle">Tạo tài khoản Booking.com của bạn</p>
              <Form name="register" onFinish={onRegisterFinish} layout="vertical" size="large">
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
                    { min: 8, message: "Mật khẩu phải chứ từ 8 ký tự bào gồm chữ hoa, chữ thường, số , ký tự đặc biệt và không có khoảng trống." },
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

                <Form.Item>
                  <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 44, fontSize: 15, fontWeight: 700 }}>
                    Đăng ký
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : (
            <>
              <h1 className="auth-title">Xác thực OTP</h1>
              <p className="auth-subtitle">
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

                <Form.Item>
                  <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 44, fontSize: 15, fontWeight: 700 }}>
                    Xác minh & Kích hoạt
                  </Button>
                </Form.Item>

                <Button type="link" block onClick={() => setStep('register')} style={{ color: '#595959' }}>
                  Quay lại thay đổi thông tin
                </Button>
              </Form>
            </>
          )}

          <Divider plain style={{ color: '#929292', fontSize: 13 }}>hoặc</Divider>

          <div style={{ textAlign: 'center', fontSize: 14 }}>
            <span style={{ color: '#595959' }}>Đã có tài khoản? </span>
            <Link to="/login" style={{ color: '#006ce4', fontWeight: 700 }}>
              Đăng nhập
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#929292' }}>
          Bằng cách đăng ký, bạn đồng ý với{' '}
          <Link to="/privacy" style={{ color: '#006ce4' }}>Điều khoản sử dụng</Link>{' '}và{' '}
          <Link to="/privacy" style={{ color: '#006ce4' }}>Chính sách bảo mật</Link> của chúng tôi.
        </div>
      </div>
    </div>
  );
};

export default Register;
