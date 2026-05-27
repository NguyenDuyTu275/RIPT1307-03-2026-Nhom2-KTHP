import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Popover, Badge } from 'antd';
import {
  SearchOutlined, UserOutlined, HeartOutlined,
  GlobalOutlined, EnvironmentOutlined,
} from '@ant-design/icons';

interface HeaderProps {
  showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showSearch = false }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const isAdmin = localStorage.getItem('role') === 'ADMIN';
  const [searchCity, setSearchCity] = useState('');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    params.set('guests', '2');
    navigate(`/search?${params.toString()}`);
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <div className="header-logo" onClick={() => navigate('/')}>
          Booking<span>.com</span>
        </div>

        {/* Mini search bar */}
        {showSearch && (
          <div className="header-search-mini" style={{ display: 'flex', gap: 4 }}>
            <Input
              prefix={<EnvironmentOutlined style={{ color: '#8c8c8c' }} />}
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
        <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Language */}
          <Button className="header-btn" type="text" style={{ color: '#fff', padding: '0 12px', height: 40, border: 'none' }}>
            <GlobalOutlined style={{ fontSize: 20 }} />
          </Button>

          {token ? (
            <>
              <Button
                className="header-btn"
                type="text"
                onClick={() => navigate('/wishlist')}
                style={{ color: '#fff', padding: '0 12px', height: 40, border: 'none' }}
              >
                <HeartOutlined style={{ fontSize: 20 }} />
              </Button>
              <Button
                className="header-btn"
                onClick={() => navigate('/my-bookings')}
                type="text"
                style={{ color: '#fff', padding: '0 16px', height: 40, border: 'none', fontWeight: 600 }}
              >
                Đặt chỗ của tôi
              </Button>
              <Popover
                content={
                  <div style={{ minWidth: 150 }}>
                    <div style={{ padding: '6px 12px', fontWeight: 700, fontSize: 14 }}>{username}</div>
                    <div style={{ borderTop: '1px solid #eee' }} />
                    <div
                      style={{ padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}
                      onClick={() => navigate('/profile')}
                    >
                      Hồ sơ của tôi
                    </div>
                    <div
                      style={{ padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}
                      onClick={() => navigate('/my-bookings')}
                    >
                      Lịch sử đặt phòng
                    </div>
                    {isAdmin && (
                      <div
                        style={{ padding: '6px 12px', cursor: 'pointer', fontSize: 13, color: '#006ce4' }}
                        onClick={() => navigate('/admin')}
                      >
                        Quản lý Admin
                      </div>
                    )}
                    <div style={{ borderTop: '1px solid #eee' }} />
                    <div
                      style={{ padding: '6px 12px', cursor: 'pointer', fontSize: 13, color: '#d4111e' }}
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
                  style={{ height: 40, padding: '0 16px', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <UserOutlined style={{ fontSize: 18 }} />
                  {username || 'Tài khoản'}
                </Button>
              </Popover>
            </>
          ) : (
            <>
              <Button
                className="header-btn"
                onClick={() => navigate('/register')}
                type="text"
                style={{ color: '#fff', padding: '0 16px', height: 40, border: 'none', fontWeight: 600 }}
              >
                Đăng ký
              </Button>
              <Button
                className="header-btn-primary header-btn"
                onClick={() => navigate('/login')}
                style={{ height: 40, padding: '0 16px', border: 'none', fontWeight: 600 }}
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
