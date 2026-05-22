import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Tag, Rate, Spin, Divider, message } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, TeamOutlined, DollarOutlined } from '@ant-design/icons';
import { hotelApi } from '../api';

const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<any>(null);
  const [rooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    hotelApi.getById(Number(id))
    .then((hotelRes) => {
      setHotel(hotelRes.data);
    }).catch((err) => {
      message.error('Không thể lấy dữ liệu từ Backend Database!');
      console.error(err);
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  if (!hotel) return <div style={{ textAlign: 'center', padding: 100 }}>Không tìm thấy khách sạn</div>;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="navbar-logo">🏨</span>
          <span className="navbar-title">Hotel Booking</span>
        </div>
        <Button icon={<ArrowLeftOutlined />} type="text" className="nav-btn"
          onClick={() => navigate('/dashboard')}>Quay lại</Button>
      </nav>

      <div className="section" style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* HOTEL INFO */}
        <Card className="detail-card">
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="hotel-detail-cover">🏨</div>
            <div style={{ flex: 1 }}>
              <h1 className="detail-title">{hotel.name}</h1>
              <p style={{ color: '#94a3b8', marginBottom: 8 }}>📍 {hotel.address}, {hotel.city}</p>
              <div style={{ marginBottom: 12 }}>
                <Rate disabled defaultValue={Math.round(hotel.ratingAvg || 0)} allowHalf />
                <span style={{ color: '#fbbf24', marginLeft: 8, fontWeight: 700 }}>{hotel.ratingAvg?.toFixed(1)}</span>
                <Tag color="green" style={{ marginLeft: 12 }}>{hotel.status}</Tag>
              </div>
              <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>{hotel.description}</p>
            </div>
          </div>
        </Card>

        {/* ROOMS */}
        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#8b9ab2' }}>
          Danh sách phòng
        </Divider>
        <Row gutter={[20, 20]}>
          {rooms.map((room: any) => (
            <Col xs={24} md={8} key={room.id}>
              <Card className="room-card" hoverable>
                <div className="room-emoji">🛏️</div>
                <h3 className="room-name">{room.name}</h3>
                <Tag color="blue" style={{ marginBottom: 10 }}>{room.type}</Tag>
                <div className="room-info">
                  <span><TeamOutlined /> {room.capacity} khách</span>
                  <span><DollarOutlined /> {room.pricePerNight?.toLocaleString('vi-VN')}₫/đêm</span>
                </div>
                <p className="room-desc">{room.description}</p>
                <p style={{ color: room.quantity > 0 ? '#10b981' : '#ef4444', fontSize: 13 }}>
                  {room.quantity > 0 ? `✅ Còn ${room.quantity} phòng` : '❌ Hết phòng'}
                </p>
                <Button
                  type="primary" block
                  disabled={room.quantity === 0}
                  icon={<CalendarOutlined />}
                  onClick={() => navigate(`/book/${room.id}`, { state: { room, hotel } })}
                  style={{ marginTop: 10 }}
                >
                  Đặt phòng
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default HotelDetail;
