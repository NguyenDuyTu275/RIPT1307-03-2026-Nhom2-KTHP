import React, { useState } from 'react';
import { Form, Input, Button, Steps, message, Result } from 'antd';
import { MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmail = (values: { email: string }) => {
    setLoading(true);
    // Mock: simulate sending OTP
    setTimeout(() => {
      setEmail(values.email);
      setStep(1);
      setLoading(false);
      message.success(`Mã xác nhận đã gửi đến ${values.email}`);
    }, 1500);
  };

  const handleOtp = (values: { otp: string }) => {
    if (values.otp.length < 4) {
      message.error('Mã OTP không hợp lệ!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 1000);
  };

  const handleNewPassword = (values: { password: string }) => {
    setLoading(true);
    setTimeout(() => {
      setStep(3);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <div className="auth-header-logo" onClick={() => navigate('/')}>Booking.com</div>
      </div>

      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">Quên mật khẩu</h1>
          <p className="auth-subtitle">
            {step === 0 && 'Nhập email để nhận mã khôi phục mật khẩu'}
            {step === 1 && `Nhập mã OTP đã gửi đến ${email}`}
            {step === 2 && 'Tạo mật khẩu mới'}
          </p>

          <Steps
            current={step > 2 ? 3 : step}
            size="small"
            style={{ marginBottom: 28 }}
            items={[
              { title: 'Email' },
              { title: 'OTP' },
              { title: 'Mật khẩu mới' },
            ]}
          />

          {step === 0 && (
            <Form onFinish={handleEmail} layout="vertical">
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
                <Input prefix={<MailOutlined />} placeholder="email@example.com" size="large" />
              </Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ fontWeight: 700 }}>
                Gửi mã xác nhận
              </Button>
            </Form>
          )}

          {step === 1 && (
            <Form onFinish={handleOtp} layout="vertical">
              <Form.Item name="otp" label="Mã xác nhận OTP" rules={[{ required: true }]}>
                <Input
                  prefix={<SafetyOutlined />}
                  placeholder="Nhập mã OTP"
                  size="large"
                  maxLength={6}
                  style={{ letterSpacing: 4, textAlign: 'center', fontSize: 20 }}
                />
              </Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ fontWeight: 700 }}>
                Xác nhận
              </Button>
              <Button type="link" block style={{ marginTop: 8 }} onClick={() => setStep(0)}>
                Gửi lại mã
              </Button>
            </Form>
          )}

          {step === 2 && (
            <Form onFinish={handleNewPassword} layout="vertical">
              <Form.Item name="password" label="Mật khẩu mới" rules={[{ required: true, min: 6 }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Ít nhất 6 ký tự" size="large" />
              </Form.Item>
              <Form.Item
                name="confirm"
                label="Xác nhận mật khẩu"
                dependencies={['password']}
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) return Promise.resolve();
                      return Promise.reject(new Error('Mật khẩu không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" size="large" />
              </Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ fontWeight: 700 }}>
                Đặt lại mật khẩu
              </Button>
            </Form>
          )}

          {step === 3 && (
            <Result
              status="success"
              title="Mật khẩu đã được đặt lại!"
              subTitle="Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ."
              extra={[
                <Button type="primary" key="login" size="large" onClick={() => navigate('/login')} style={{ fontWeight: 700 }}>
                  Đăng nhập ngay
                </Button>,
              ]}
            />
          )}

          {step < 3 && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Link to="/login" style={{ color: '#006ce4', fontSize: 14 }}>
                ← Quay lại đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
