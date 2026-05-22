import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Skeleton, Tag } from 'antd';
import { FireOutlined, StarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchWidget from '../components/SearchWidget';
import HotelCard from '../components/HotelCard';
import { hotelApi } from '../api';

const DESTINATIONS = [
  { name: 'Hà Nội', img: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&q=80', count: 1240 },
  { name: 'Hồ Chí Minh', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80', count: 2380 },
  { name: 'Đà Nẵng', img: 'https://images.unsplash.com/photo-1540308938-c3e3ce1ad6c5?w=600&q=80', count: 870 },
  { name: 'Hội An', img: 'https://images.unsplash.com/photo-1600459374449-9a14f2aa95b6?w=600&q=80', count: 560 },
  { name: 'Nha Trang', img: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80', count: 730 },
  { name: 'Phú Quốc', img: 'https://images.unsplash.com/photo-1571983824985-c28c6f1e7b9a?w=600&q=80', count: 410 },
];

const DEALS = [
  { title: 'Hè rực rỡ — Giảm đến 30%', desc: 'Đặt sớm, giảm ngay cho chuyến hè', badge: '-30%', color: '#cc0000', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
  { title: 'Cuối tuần lý tưởng', desc: 'Nghỉ dưỡng 2 ngày cuối tuần giá cực tốt', badge: '-20%', color: '#006ce4', img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&q=80' },
  { title: 'Đặt sớm tiết kiệm', desc: 'Đặt trước 30 ngày, hưởng giá ưu đãi', badge: 'Đặt sớm', color: '#008234', img: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=400&q=80' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    hotelApi.getAll()
      .then(res => setHotels(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleWish = (id: number) => {
    const next = wishlist.includes(id) ? wishlist.filter(w => w !== id) : [...wishlist, id];
    setWishlist(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
  };

  return (
    <div className="page-wrapper">
      <Header />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Tìm khách sạn ưng ý nhất</h1>
          <p className="hero-subtitle">Hơn 10.000 chỗ nghỉ tại Việt Nam với giá tốt nhất</p>
          <div className="hero-search">
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="section" style={{ background: '#f5f5f5' }}>
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">🗺️ Điểm đến phổ biến</h2>
              <p className="section-subtitle">Những thành phố được du khách yêu thích nhất</p>
            </div>
            <a className="section-link" onClick={() => navigate('/destinations')}>Xem tất cả →</a>
          </div>
          <Row gutter={[12, 12]}>
            {DESTINATIONS.map((dest) => (
              <Col key={dest.name} xs={12} sm={8} md={4}>
                <div
                  className="dest-card"
                  onClick={() => navigate(`/search?city=${encodeURIComponent(dest.name)}`)}
                >
                  <img src={dest.img} alt={dest.name} className="dest-card-img" />
                  <div className="dest-card-overlay">
                    <div className="dest-card-name">{dest.name}</div>
                    <div className="dest-card-count">{dest.count.toLocaleString()} chỗ nghỉ</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── FEATURED HOTELS ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">🏨 Khách sạn nổi bật</h2>
              <p className="section-subtitle">Được đánh giá cao và đặt nhiều nhất tuần này</p>
            </div>
            <a className="section-link" onClick={() => navigate('/search')}>Xem tất cả →</a>
          </div>

          {loading ? (
            <Row gutter={[16, 16]}>
              {[...Array(4)].map((_, i) => (
                <Col key={i} xs={24} sm={12} md={6}>
                  <Skeleton active style={{ borderRadius: 8 }} />
                </Col>
              ))}
            </Row>
          ) : hotels.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#929292' }}>
              <div style={{ fontSize: 48 }}>🏨</div>
              <p style={{ marginTop: 12, fontSize: 16 }}>Chưa có khách sạn nào. Vui lòng kiểm tra backend!</p>
            </div>
          ) : (
            <Row gutter={[16, 20]}>
              {hotels.slice(0, 8).map((hotel) => (
                <Col key={hotel.id} xs={24} sm={12} md={6}>
                  <HotelCard
                    hotel={hotel}
                    wished={wishlist.includes(hotel.id)}
                    onWishToggle={() => toggleWish(hotel.id)}
                    onClick={() => navigate(`/hotels/${hotel.id}`)}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </section>

      {/* ── DEALS ── */}
      <section className="section" style={{ background: '#f5f5f5' }}>
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">🔥 Ưu đãi hôm nay</h2>
              <p className="section-subtitle">Đừng bỏ lỡ các deal cực hot!</p>
            </div>
            <a className="section-link" onClick={() => navigate('/deals')}>Xem tất cả →</a>
          </div>
          <Row gutter={[16, 16]}>
            {DEALS.map((deal) => (
              <Col key={deal.title} xs={24} sm={8}>
                <div className="deal-card" onClick={() => navigate('/deals')} style={{ cursor: 'pointer' }}>
                  <img src={deal.img} alt={deal.title} className="deal-card-img" onError={(e) => ((e.target as any).style.display = 'none')} />
                  <div className="deal-card-body">
                    <div className="deal-badge" style={{ background: deal.color }}>{deal.badge}</div>
                    <div className="deal-card-title">{deal.title}</div>
                    <div className="deal-card-desc">{deal.desc}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── WHY BOOKING ── */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 32 }}>
            Tại sao chọn Booking.com?
          </h2>
          <Row gutter={[32, 32]}>
            {[
              { icon: '🏆', title: 'Giá tốt nhất đảm bảo', desc: 'Chúng tôi cam kết bạn sẽ nhận được giá tốt nhất hoặc hoàn lại tiền' },
              { icon: '🔒', title: 'Thanh toán an toàn', desc: 'Dữ liệu của bạn được mã hóa và bảo vệ bởi hệ thống bảo mật cao cấp' },
              { icon: '📞', title: 'Hỗ trợ 24/7', desc: 'Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc của bạn' },
              { icon: '⭐', title: 'Triệu đánh giá thực', desc: 'Tất cả đánh giá đều đến từ khách đã lưu trú thực sự' },
            ].map((item) => (
              <Col key={item.title} xs={24} sm={12} md={6}>
                <div style={{ textAlign: 'center', padding: '0 16px' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: '#595959', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
