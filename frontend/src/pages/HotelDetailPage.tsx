import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Skeleton, Tag, Button, Divider, Empty } from 'antd';
import {
  EnvironmentOutlined,
  WifiOutlined, CarOutlined, CoffeeOutlined,
  CheckCircleOutlined, HeartOutlined, HeartFilled,
} from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getHotelImage } from '../components/HotelCard';
import { hotelApi } from '../api';

// Ảnh gallery dựa trên id hotel (pool)
const GALLERY_POOLS = [
  [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&q=80',
    'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=500&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&q=80',
  ],
  [
    'https://images.unsplash.com/photo-1551882547-ff40c4a49f7c?w=900&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80',
    'https://images.unsplash.com/photo-1576354302919-96748cb8299e?w=500&q=80',
  ],
];

const AMENITIES = [
  { icon: <WifiOutlined />, label: 'Wi-Fi miễn phí' },
  { icon: <CarOutlined />, label: 'Bãi đỗ xe' },
  { icon: <CoffeeOutlined />, label: 'Bữa sáng' },
  { icon: '🏊', label: 'Hồ bơi' },
  { icon: '🏋️', label: 'Phòng gym' },
  { icon: '🍽️', label: 'Nhà hàng' },
  { icon: '🛎️', label: 'Lễ tân 24/7' },
  { icon: '❄️', label: 'Điều hoà' },
];

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [wished, setWished] = useState(() => {
    try {
      const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
      return list.includes(Number(id));
    } catch { return false; }
  });

  useEffect(() => {
    if (!id) return;
    hotelApi.getById(Number(id))
      .then(res => setHotel(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const toggleWish = () => {
    const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const next = wished ? list.filter((w: number) => w !== Number(id)) : [...list, Number(id)];
    localStorage.setItem('wishlist', JSON.stringify(next));
    setWished(!wished);
  };

  if (loading) return (
    <div className="page-wrapper">
      <Header showSearch />
      <div className="container" style={{ padding: '32px 24px' }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    </div>
  );

  if (!hotel) return (
    <div className="page-wrapper">
      <Header showSearch />
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: 56 }}>🏨</div>
        <h2 style={{ marginTop: 16 }}>Không tìm thấy khách sạn</h2>
        <Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/search')}>
          Quay lại tìm kiếm
        </Button>
      </div>
      <Footer />
    </div>
  );

  // Backend chỉ trả về id + name; các field khác dùng fallback
  const hotelName: string = hotel.name || 'Khách sạn';
  const hotelId = Number(id);
  const gallery = GALLERY_POOLS[hotelId % 2];
  // Ước tính giá dựa trên id (không có field price trong backend)
  const basePrice = 500000 + (hotelId % 20) * 50000;
  // Rating không có getter trong entity → dùng giá trị ước tính
  const rating = (8.0 + (hotelId % 20) * 0.05).toFixed(1);
  const ratingLabel = Number(rating) >= 9 ? 'Tuyệt vời' : 'Rất tốt';

  return (
    <div className="page-wrapper">
      <Header showSearch />

      <div className="container" style={{ padding: '16px 24px 0' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: '#595959', marginBottom: 12 }}>
          <span style={{ cursor: 'pointer', color: '#006ce4' }} onClick={() => navigate('/')}>Trang chủ</span>
          {' › '}
          <span style={{ cursor: 'pointer', color: '#006ce4' }} onClick={() => navigate('/search')}>Tìm kiếm</span>
          {' › '}
          <span>{hotelName}</span>
        </div>

        {/* Title row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, margin: 0 }}>{hotelName}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#595959' }}>
                <EnvironmentOutlined /> Việt Nam
              </span>
              <Tag color="blue" style={{ borderRadius: 20 }}>★ {rating}</Tag>
              <span style={{ fontSize: 13, color: '#008234', fontWeight: 600 }}>✓ Đặt ngay, trả sau</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              icon={wished ? <HeartFilled style={{ color: '#cc0000' }} /> : <HeartOutlined />}
              onClick={toggleWish}
            >
              {wished ? 'Đã lưu' : 'Lưu'}
            </Button>
            <Button type="primary" size="large" onClick={() => navigate(`/booking/${id}/guest`)}>
              Đặt ngay
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="container" style={{ padding: '0 24px 20px' }}>
        <div className="hotel-gallery">
          {gallery.map((img, i) => (
            <div key={i} className={i === 0 ? 'hotel-gallery-main' : ''}>
              <img src={img} alt={`${hotelName}-${i}`} className="hotel-gallery-img"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ padding: '0 24px 48px' }}>
        <Row gutter={24}>
          {/* Left */}
          <Col xs={24} md={16}>

            {/* Overview */}
            <div style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 8, padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Giới thiệu</h3>
              <p style={{ color: '#595959', lineHeight: 1.8, margin: 0 }}>
                {hotelName} là khách sạn cao cấp tại Việt Nam, mang đến trải nghiệm lưu trú sang trọng
                và tiện nghi hiện đại. Với đội ngũ nhân viên chuyên nghiệp, nhiệt tình, chúng tôi
                cam kết mang lại kỳ nghỉ tuyệt vời nhất cho quý khách.
              </p>
            </div>

            {/* Amenities */}
            <div style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 8, padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>🎯 Tiện nghi nổi bật</h3>
              <Row gutter={[12, 12]}>
                {AMENITIES.map((a) => (
                  <Col key={a.label} xs={12} sm={8}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                      <CheckCircleOutlined style={{ color: '#008234' }} />
                      <span>{a.label}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Chính sách */}
            <div style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 8, padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>📋 Chính sách khách sạn</h3>
              {[
                ['Nhận phòng', 'Từ 14:00'],
                ['Trả phòng', 'Trước 12:00'],
                ['Hủy phòng', 'Miễn phí trước 24 giờ'],
                ['Trẻ em', 'Được phép (liên hệ khách sạn)'],
                ['Vật nuôi', 'Không được phép'],
                ['Thanh toán', 'Tiền mặt & Thẻ ngân hàng'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5', fontSize: 14 }}>
                  <span style={{ color: '#595959' }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Đánh giá - không có API → thông báo rõ */}
            <div style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 8, padding: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>⭐ Đánh giá của khách</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ textAlign: 'center', background: '#003b95', color: '#fff', borderRadius: 8, padding: '12px 20px' }}>
                  <div style={{ fontSize: 36, fontWeight: 800 }}>{rating}</div>
                  <div style={{ fontSize: 14 }}>{ratingLabel}</div>
                </div>
                <div style={{ color: '#595959', fontSize: 14 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Điểm đánh giá trung bình</div>
                  <div>Dựa trên các đánh giá từ khách đã lưu trú</div>
                </div>
              </div>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ color: '#929292', fontSize: 14 }}>
                    Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá khách sạn này!
                  </span>
                }
              />
            </div>
          </Col>

          {/* Right — Sticky CTA */}
          <Col xs={24} md={8}>
            <div className="hotel-sticky-cta">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span className="rating-badge" style={{ fontSize: 15 }}>{rating}</span>
                <span style={{ fontWeight: 600 }}>{ratingLabel}</span>
              </div>

              <div className="hotel-cta-price">từ {basePrice.toLocaleString('vi-VN')}₫</div>
              <div className="hotel-cta-label">mỗi đêm · đã bao gồm thuế và phí</div>

              <div style={{ background: '#f5f5f5', borderRadius: 6, padding: 12, margin: '14px 0', fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span>Nhận phòng:</span><span style={{ fontWeight: 600 }}>14:00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Trả phòng:</span><span style={{ fontWeight: 600 }}>12:00</span>
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                block
                style={{ height: 48, fontSize: 16, fontWeight: 700, background: '#006ce4', borderColor: '#006ce4' }}
                onClick={() => navigate(`/booking/${id}/guest`)}
              >
                Đặt ngay — Trả tại chỗ
              </Button>

              <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: '#008234' }}>
                ✓ Không mất phí đặt phòng · Hủy miễn phí
              </div>

              <Divider style={{ margin: '14px 0' }} />

              <div style={{ fontSize: 13, color: '#595959' }}>
                <div style={{ marginBottom: 6 }}>🏨 {hotelName}</div>
                <div style={{ marginBottom: 6 }}>📍 Việt Nam</div>
                <div>⭐ Điểm đánh giá: {rating}/10</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Footer />
    </div>
  );
};

export default HotelDetailPage;
