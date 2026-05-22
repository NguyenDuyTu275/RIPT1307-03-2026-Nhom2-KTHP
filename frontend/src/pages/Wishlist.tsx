import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Empty, Button } from 'antd';
import { HeartFilled, DeleteOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HotelCard from '../components/HotelCard';
import { hotelApi } from '../api';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hotelApi.getAll()
      .then(res => setHotels(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const wishedHotels = hotels.filter(h => wishlist.includes(h.id));

  const removeWish = (id: number) => {
    const next = wishlist.filter(w => w !== id);
    setWishlist(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
  };

  const clearAll = () => {
    setWishlist([]);
    localStorage.setItem('wishlist', '[]');
  };

  return (
    <div className="page-wrapper">
      <Header showSearch />

      <div style={{ background: '#003b95', padding: '24px 0' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
            <HeartFilled style={{ color: '#ff4d4f', marginRight: 10 }} />
            Danh sách yêu thích
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
            {wishedHotels.length} khách sạn đã lưu
          </p>
        </div>
      </div>

      <div style={{ background: '#f5f5f5', flex: 1, padding: '24px 0 48px' }}>
        <div className="container">
          {wishedHotels.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 8, padding: '64px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 56 }}>💔</div>
              <h2 style={{ marginTop: 16, fontSize: 20, fontWeight: 700 }}>Chưa có gì trong danh sách yêu thích</h2>
              <p style={{ color: '#595959', marginBottom: 24 }}>Khi tìm kiếm khách sạn, nhấn ❤️ để lưu lại nhé!</p>
              <Button type="primary" size="large" onClick={() => navigate('/search')} style={{ fontWeight: 700 }}>
                Tìm kiếm khách sạn
              </Button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{wishedHotels.length} khách sạn yêu thích</span>
                <Button icon={<DeleteOutlined />} danger onClick={clearAll} size="small">
                  Xóa tất cả
                </Button>
              </div>

              <Row gutter={[16, 20]}>
                {wishedHotels.map(hotel => (
                  <Col key={hotel.id} xs={24} sm={12} md={6}>
                    <HotelCard
                      hotel={hotel}
                      wished={true}
                      onWishToggle={() => removeWish(hotel.id)}
                      onClick={() => navigate(`/hotels/${hotel.id}`)}
                    />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
