import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Skeleton } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchWidget from '../components/SearchWidget';
import HotelCard from '../components/HotelCard';
import { hotelApi } from '../api';
import { useWishlist } from '../context/WishlistContext';
import { TrophyTwoTone, SafetyCertificateTwoTone, CustomerServiceTwoTone, StarTwoTone } from '@ant-design/icons';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInWishlist, toggleWish } = useWishlist();

  useEffect(() => {
    hotelApi.getAll()
      .then(res => setHotels(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);


  return (
    <div className="page-wrapper">
      <Header />

      {/* ── HERO (Booking.com style) ── */}
      <section className="bk-hero">
        <div className="bk-hero-inner">
          <h1 className="bk-hero-title">Tìm chỗ nghỉ tiếp theo của bạn</h1>
          <p className="bk-hero-subtitle">Tìm kiếm ưu đãi khách sạn, nhà nghỉ và nhiều hơn nữa...</p>
          <div className="bk-hero-search">
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* ── FEATURED HOTELS ── */}
      <section className="bk-section">
        <div className="bk-section-inner">
          <div className="bk-section-header">
            <div>
              <h2 className="bk-section-title">Khách sạn nổi bật</h2>
              <p className="bk-section-subtitle">Được đánh giá cao và đặt nhiều nhất tuần này</p>
            </div>
            <button className="bk-section-link" onClick={() => navigate('/search')}>Xem tất cả →</button>
          </div>

          {loading ? (
            <Row gutter={[16, 16]}>
              {[...Array(4)].map((_, i) => (
                <Col key={i} xs={24} sm={12} md={6}>
                  <Skeleton active />
                </Col>
              ))}
            </Row>
          ) : hotels.length === 0 ? (
            <div className="bk-empty-state">
              <div style={{ fontSize: 56 }}>🏨</div>
              <p>Chưa có khách sạn nào. Vui lòng kiểm tra backend!</p>
            </div>
          ) : (
            <Row gutter={[16, 20]}>
              {hotels.slice(0, 8).map((hotel) => (
                <Col key={hotel.id} xs={24} sm={12} md={6}>
                  <HotelCard
                    hotel={hotel}
                    wished={isInWishlist(hotel.id)}
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
      <section className="bk-why-section">
        <div className="bk-section-inner">
          <h2 className="bk-section-title" style={{ textAlign: 'center', marginBottom: 36 }}>
            Tại sao chọn chúng tôi?
          </h2>
          <Row gutter={[24, 24]}>
            {[
              { icon: <TrophyTwoTone twoToneColor="#006ce4" style={{ fontSize: 36 }} />, title: 'Giá tốt nhất đảm bảo', desc: 'Chúng tôi cam kết bạn sẽ nhận được giá tốt nhất hoặc hoàn lại tiền' },
              { icon: <SafetyCertificateTwoTone twoToneColor="#006ce4" style={{ fontSize: 36 }} />, title: 'Thanh toán an toàn', desc: 'Dữ liệu của bạn được mã hóa và bảo vệ bởi hệ thống bảo mật cao cấp' },
              { icon: <CustomerServiceTwoTone twoToneColor="#006ce4" style={{ fontSize: 36 }} />, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc của bạn' },
              { icon: <StarTwoTone twoToneColor="#febb02" style={{ fontSize: 36 }} />, title: 'Triệu đánh giá thực', desc: 'Tất cả đánh giá đều đến từ khách đã lưu trú thực sự' },
            ].map((item) => (
              <Col key={item.title} xs={24} sm={12} md={6}>
                <div className="bk-why-card">
                  <div className="bk-why-icon">{item.icon}</div>
                  <div className="bk-why-title">{item.title}</div>
                  <div className="bk-why-desc">{item.desc}</div>
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
