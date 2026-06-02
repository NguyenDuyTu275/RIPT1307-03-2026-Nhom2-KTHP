import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Skeleton } from 'antd';
import { HeartFilled, DeleteOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HotelCard from '../components/HotelCard';
import { hotelApi } from '../api';
import { useWishlist } from '../context/WishlistContext';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { wishlist, removeWish, clearAll } = useWishlist();
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) {
      setHotels([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(wishlist.map(id => hotelApi.getById(Number(id))))
      .then(responses => {
        const fetchedHotels = responses.map(res => res.data).filter(Boolean);
        setHotels(fetchedHotels);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [wishlist]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />

      {/* Phần Banner Xanh Đậm */}
      <div style={{ background: '#003b95', padding: '24px 0', color: '#fff' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 24px' }}>
          <button
            onClick={() => navigate('/')}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'rgba(255,255,255,0.8)', 
              cursor: 'pointer', 
              fontSize: 14, 
              fontWeight: 600,
              padding: 0,
              marginBottom: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            ← Quay lại trang chủ
          </button>
          
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px 0', display: 'flex', alignItems: 'center' }}>
            <HeartFilled style={{ color: '#ff4d4f', marginRight: 12, fontSize: 24 }} />
            Danh sách yêu thích
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            {wishlist.length} khách sạn đã lưu
          </p>
        </div>
      </div>

      {/* Phần Nội Dung Chính */}
      <div style={{ flex: 1, padding: '32px 0' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 24px' }}>
          {loading ? (
            <Row gutter={[16, 20]}>
              {[...Array(wishlist.length || 4)].map((_, i) => (
                <Col key={i} xs={24} sm={12} md={6}>
                  <div style={{ background: '#fff', borderRadius: 8, padding: 16, height: 300 }}>
                    <Skeleton active paragraph={{ rows: 4 }} />
                  </div>
                </Col>
              ))}
            </Row>
          ) : hotels.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 8, padding: '64px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>💔</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px 0' }}>Chưa có gì trong danh sách yêu thích</h2>
              <p style={{ color: '#595959', marginBottom: 24, fontSize: 15 }}>Khi tìm kiếm khách sạn, nhấn ❤️ để lưu lại nhé!</p>
              <Button type="primary" size="large" onClick={() => navigate('/')} style={{ fontWeight: 700, borderRadius: 4 }}>
                Tìm kiếm khách sạn
              </Button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>{hotels.length} khách sạn yêu thích</span>
                <Button icon={<DeleteOutlined />} danger onClick={clearAll} size="small" style={{ borderRadius: 4 }}>
                  Xóa tất cả
                </Button>
              </div>

              <Row gutter={[16, 20]}>
                {hotels.map(hotel => (
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
