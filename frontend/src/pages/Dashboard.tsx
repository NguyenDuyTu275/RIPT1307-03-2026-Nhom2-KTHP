import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Spin, Empty, message, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  GlobalOutlined, MenuOutlined,
  UserOutlined, CalendarOutlined, CarOutlined, HomeOutlined, 
  CarFilled
} from '@ant-design/icons';
import { hotelApi } from '../api';

const Dashboard: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    hotelApi.getAll()
      .then(res => setHotels(res.data || []))
      .catch((err) => {
        message.error('Không thể tải danh sách khách sạn từ Backend!');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    message.success('Đã đăng xuất!');
    navigate('/login');
  };

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  return (
    <div className="dashboard">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <span className="navbar-title">Booking.com</span>
        </div>
        <div className="navbar-menu">
          <span style={{ color: '#fff', fontWeight: 500, cursor: 'pointer' }}>VND</span>
          <span style={{ color: '#fff', cursor: 'pointer', margin: '0 8px' }}>🇻🇳</span>
          <span style={{ color: '#fff', fontSize: '18px', cursor: 'pointer' }}>?</span>
          <span style={{ color: '#fff', fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Đăng chỗ nghỉ của Quý vị</span>
          
          {token ? (
            <>
              {username === 'admin' && (
                <Button className="nav-btn-outline" onClick={() => navigate('/admin')} style={{ marginLeft: 8 }}>Quản lý User</Button>
              )}
              <Button className="nav-btn-outline" onClick={() => navigate('/my-bookings')} style={{ marginLeft: 8 }}>Đặt phòng của tôi</Button>
              <Button className="nav-btn-outline" onClick={() => navigate('/profile')} style={{ marginLeft: 8 }}>Cá nhân</Button>
              <Button className="nav-btn" onClick={handleLogout} style={{ marginLeft: 16 }}>Đăng xuất</Button>
            </>
          ) : (
            <>
              <Button className="nav-btn" onClick={() => navigate('/register')} style={{ marginLeft: 16 }}>Đăng ký</Button>
              <Button className="nav-btn" onClick={() => navigate('/login')}>Đăng nhập</Button>
            </>
          )}
        </div>
      </nav>
      
      <div style={{ background: 'var(--header-bg)', padding: '0 15% 16px', display: 'flex', gap: '8px' }}>
         <Button type="text" style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', borderRadius: '24px', padding: '8px 16px', height: 'auto', border: '1px solid #fff' }} icon={<HomeOutlined />}>Lưu trú</Button>
         <Button type="text" style={{ color: '#fff', borderRadius: '24px', padding: '8px 16px', height: 'auto' }} icon={<GlobalOutlined />}>Chuyến bay</Button>
         <Button type="text" style={{ color: '#fff', borderRadius: '24px', padding: '8px 16px', height: 'auto' }} icon={<GlobalOutlined />}>Chuyến bay + Khách sạn</Button>
         <Button type="text" style={{ color: '#fff', borderRadius: '24px', padding: '8px 16px', height: 'auto' }} icon={<CarOutlined />}>Thuê xe</Button>
         <Button type="text" style={{ color: '#fff', borderRadius: '24px', padding: '8px 16px', height: 'auto' }} icon={<MenuOutlined />}>Hoạt động</Button>
         <Button type="text" style={{ color: '#fff', borderRadius: '24px', padding: '8px 16px', height: 'auto' }} icon={<CarFilled />}>Taxi sân bay</Button>
      </div>

      {/* HERO */}
      <div className="hero">
        <h1 className="hero-title">Tìm chỗ nghỉ tiếp theo</h1>
        <p className="hero-sub">Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...</p>
      </div>
      
      {/* SEARCH BOX */}
      <div className="search-box-container">
         <div className="search-box-item" style={{ flex: 1.5 }}>
            <HomeOutlined style={{ color: 'var(--text-secondary)', fontSize: 20 }} />
            <input type="text" placeholder="Bạn muốn đến đâu?" style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14 }} />
         </div>
         <div className="search-box-item">
            <CalendarOutlined style={{ color: 'var(--text-secondary)', fontSize: 20 }} />
            <span style={{ color: 'var(--text-primary)' }}>Nhận phòng — Trả phòng</span>
         </div>
         <div className="search-box-item">
            <UserOutlined style={{ color: 'var(--text-secondary)', fontSize: 20 }} />
            <span style={{ color: 'var(--text-primary)' }}>2 người lớn · 0 trẻ em · 1 phòng</span>
         </div>
         <button className="search-box-btn">Tìm</button>
      </div>
      
      <div style={{ margin: '8px 15% 0', display: 'flex', gap: 24, fontSize: 14, color: 'var(--text-primary)' }}>
         <Checkbox>Tôi đi công tác</Checkbox>
         <Checkbox>Thêm các chuyến bay vào tìm kiếm của tôi</Checkbox>
      </div>

      {/* HOTEL LIST / Ưu đãi */}
      <div className="section">
        <h2 className="section-title">Ưu đãi</h2>
        <p className="section-subtitle">Khuyến mãi, giảm giá và ưu đãi đặc biệt dành riêng cho bạn</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
        ) : hotels.length === 0 ? (
          <Empty description="Chưa có ưu đãi nào" />
        ) : (
          <Row gutter={[16, 16]}>
            {hotels.map((hotel: any) => (
              <Col xs={24} sm={12} lg={6} key={hotel.id}>
                <Card
                  className="hotel-card"
                  hoverable
                  cover={
                    <div className="hotel-card-cover">
                      <div className="hotel-card-emoji">🏨</div>
                    </div>
                  }
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                >
                  <Card.Meta
                    title={<span className="hotel-name">{hotel.name}</span>}
                    description={
                      <div>
                        <p className="hotel-city">{hotel.city}</p>
                        <div className="hotel-rating">
                           <div className="hotel-rating-badge">{hotel.ratingAvg?.toFixed(1) || '9.0'}</div>
                           Tuyệt vời
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
