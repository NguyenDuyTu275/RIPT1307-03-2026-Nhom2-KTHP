import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, CalendarOutlined, LogoutOutlined } from '@ant-design/icons';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'bạn';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="welcome-container">
      <div style={{ fontSize: 80, marginBottom: 16 }}>🏨</div>
      <h1 className="welcome-title">Chào mừng, {username}!</h1>
      <p className="welcome-subtitle">Đăng nhập thành công. Hãy bắt đầu khám phá nhé!</p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeUp 0.6s ease-out 0.4s both' }}>
        <Button
          type="primary"
          icon={<HomeOutlined />}
          size="large"
          style={{ minWidth: 180 }}
          onClick={() => navigate('/dashboard')}
        >
          Khám phá khách sạn
        </Button>
        <Button
          icon={<CalendarOutlined />}
          size="large"
          className="auth-ghost-btn"
          style={{ minWidth: 180 }}
          onClick={() => navigate('/my-bookings')}
        >
          Đặt phòng của tôi
        </Button>
        <Button
          danger
          icon={<LogoutOutlined />}
          size="large"
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
