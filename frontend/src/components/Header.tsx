import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Popover, Badge } from 'antd';
import {
  SearchOutlined, UserOutlined, HeartOutlined,
  GlobalOutlined, EnvironmentOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

interface HeaderProps {
  showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showSearch = false }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const isAdmin = localStorage.getItem('role') === 'ADMIN';
  const [searchCity, setSearchCity] = useState('');
  const [guests, setGuests] = useState(2);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    params.set('guests', String(guests));
    navigate(`/search?${params.toString()}`);
  };



  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <div className="header-logo" onClick={() => navigate('/')}>
          Booking<span>.com</span>
        </div>

        {/* Mini search bar (only when showSearch=true) */}
        {showSearch && (
          <div className="header-search-mini" style={{ display: 'flex', gap: 4 }}>
            <Input
              prefix={<EnvironmentOutlined style={{ color: '#929292' }} />}
              placeholder="Bạn muốn đến đâu?"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onPressEnter={handleSearch}
              style={{ flex: 1 }}
              size="middle"
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              size="middle"
            />
          </div>
        )}

        {/* Nav buttons */}
        <nav className="header-nav">
          {/* Language */}
          <Button className="header-btn" icon={<GlobalOutlined />} type="text" style={{ color: '#fff', border: 'none' }} />

          {token ? (
            <>
              <Button
                className="header-btn"
                icon={<HeartOutlined />}
                onClick={() => navigate('/wishlist')}
                type="text"
                style={{ color: '#fff', border: 'none' }}
              />
              <Badge dot={false}>
                <Button
                  className="header-btn"
                  onClick={() => navigate('/my-bookings')}
                  type="text"
                  style={{ color: '#fff', border: 'none' }}
                >
                  Đặt chỗ của tôi
                </Button>
              </Badge>
              <Popover
                content={
                  <div style={{ minWidth: 160 }}>
                    <div style={{ padding: '8px 12px', fontWeight: 700, fontSize: 14 }}>{username}</div>
                    <div style={{ borderTop: '1px solid #eee' }} />
                    <div
                      style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 14 }}
                      onClick={() => navigate('/profile')}
                    >
                      Hồ sơ của tôi
                    </div>
                    <div
                      style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 14 }}
                      onClick={() => navigate('/my-bookings')}
                    >
                      Lịch sử đặt phòng
                    </div>
                    {isAdmin && (
                      <div
                        style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 14, color: '#006ce4' }}
                        onClick={() => navigate('/admin')}
                      >
                        Quản lý Admin
                      </div>
                    )}
                    <div style={{ borderTop: '1px solid #eee' }} />
                    <div
                      style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 14, color: '#cc0000' }}
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </div>
                  </div>
                }
                trigger="click"
                placement="bottomRight"
              >
                <Button
                  className="header-btn-primary header-btn"
                  icon={<UserOutlined />}
                >
                  {username || 'Tài khoản'}
                </Button>
              </Popover>
            </>
          ) : (
            <>
              <Button
                className="header-btn"
                onClick={() => navigate('/register')}
              >
                Đăng ký
              </Button>
              <Button
                className="header-btn-primary header-btn"
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
