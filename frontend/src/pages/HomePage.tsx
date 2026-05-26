import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Skeleton } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchWidget from '../components/SearchWidget';
import HotelCard from '../components/HotelCard';
import { hotelApi } from '../api';



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
