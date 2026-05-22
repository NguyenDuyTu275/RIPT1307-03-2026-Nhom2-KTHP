import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Tag } from 'antd';
import { FireOutlined, ThunderboltOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DEALS_DATA = [
  { id: 1, title: 'Hè Rực Rỡ — Giảm 30%', desc: 'Đặt phòng cho các ngày hè từ 1/6 – 31/8, nhận ngay 30% giảm giá cho tất cả khách sạn 4-5 sao.', badge: '-30%', color: '#cc0000', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80', expires: '31/08/2025', tag: 'Hot' },
  { id: 2, title: 'Cuối Tuần Lý Tưởng', desc: 'Nghỉ 2 đêm cuối tuần từ Thứ 6 – Chủ Nhật, nhận ngay ưu đãi giảm 20% và bữa sáng miễn phí.', badge: '-20%', color: '#006ce4', img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500&q=80', expires: '30/06/2025', tag: 'Phổ biến' },
  { id: 3, title: 'Đặt Sớm Tiết Kiệm', desc: 'Đặt trước 30 ngày, nhận ngay giá ưu đãi và miễn phí hủy linh hoạt cho mọi loại phòng.', badge: 'Đặt sớm', color: '#008234', img: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=500&q=80', expires: '31/12/2025', tag: 'Mới' },
  { id: 4, title: 'Combo Nghỉ Dưỡng', desc: 'Kết hợp khách sạn + vé máy bay, tiết kiệm lên đến 25% so với đặt riêng lẻ.', badge: '-25%', color: '#f56600', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=80', expires: '15/07/2025', tag: 'Combo' },
  { id: 5, title: 'Genius Member Exclusive', desc: 'Thành viên Genius nhận thêm 15% giảm giá và nhiều đặc quyền khác tại hàng nghìn khách sạn.', badge: '15% Extra', color: '#003b95', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80', expires: 'Không giới hạn', tag: 'Member' },
  { id: 6, title: 'Last Minute Deal', desc: 'Phòng xịn, giá tốt cho chuyến đi ngay hôm nay. Đặt trong ngày, giảm giá ngay đến 40%!', badge: '-40%', color: '#cc0000', img: 'https://images.unsplash.com/photo-1551882547-ff40c4a49f7c?w=500&q=80', expires: 'Hàng ngày', tag: 'Giới hạn' },
];

const Deals: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <Header showSearch />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #cc0000, #ff6600)', padding: '48px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔥</div>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Ưu đãi & Khuyến mãi</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18 }}>Những deal cực hot không thể bỏ lỡ!</p>
        </div>
      </div>

      {/* Banner strip */}
      <div style={{ background: '#febb02', padding: '12px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>
            <ThunderboltOutlined /> Flash Sale: Đặt ngay hôm nay — tiết kiệm thêm 10% cho mọi đặt phòng!
          </span>
        </div>
      </div>

      {/* Deals grid */}
      <div style={{ background: '#f5f5f5', flex: 1, padding: '40px 0 64px' }}>
        <div className="container">
          <Row gutter={[20, 20]}>
            {DEALS_DATA.map(deal => (
              <Col key={deal.id} xs={24} sm={12} md={8}>
                <div
                  className="deal-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/search')}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={deal.img}
                      alt={deal.title}
                      style={{ width: '100%', height: 200, objectFit: 'cover' }}
                      onError={(e) => ((e.target as any).style.display = 'none')}
                    />
                    <div style={{
                      position: 'absolute', top: 12, left: 12,
                      background: deal.color, color: '#fff',
                      padding: '4px 12px', borderRadius: 4,
                      fontSize: 14, fontWeight: 800,
                    }}>
                      {deal.badge}
                    </div>
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'rgba(0,0,0,0.6)', color: '#fff',
                      padding: '2px 8px', borderRadius: 4,
                      fontSize: 12, fontWeight: 600,
                    }}>
                      {deal.tag}
                    </div>
                  </div>
                  <div className="deal-card-body">
                    <div className="deal-card-title" style={{ fontSize: 17, marginBottom: 6 }}>{deal.title}</div>
                    <div className="deal-card-desc" style={{ marginBottom: 12 }}>{deal.desc}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#929292' }}>Hết hạn: {deal.expires}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: deal.color }}>Đặt ngay →</span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Deals;
