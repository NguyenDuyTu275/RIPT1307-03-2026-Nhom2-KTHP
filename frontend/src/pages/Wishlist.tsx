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
    <div className="page-wrapper flex flex-col min-h-screen">
      <Header showSearch />

      <div className="bg-[#003b95] py-6">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-white/80 text-sm font-semibold pb-3"
          >
            ← Quay lại trang chủ
          </button>
          <h1 className="text-white text-2xl font-extrabold mb-1 flex items-center">
            <HeartFilled className="text-[#ff4d4f] mr-2.5" />
            Danh sách yêu thích
          </h1>
          <p className="text-white/80 text-sm m-0">
            {wishlist.length} khách sạn đã lưu
          </p>
        </div>
      </div>

      <div className="bg-[#f5f5f5] flex-1 py-6 pb-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <Row gutter={[16, 20]}>
              {[...Array(wishlist.length || 4)].map((_, i) => (
                <Col key={i} xs={24} sm={12} md={6}>
                  <div className="bg-white rounded-lg p-4 h-[300px]">
                    <Skeleton active paragraph={{ rows: 4 }} />
                  </div>
                </Col>
              ))}
            </Row>
          ) : hotels.length === 0 ? (
            <div className="bg-white rounded-lg py-16 px-6 text-center">
              <div className="text-6xl mb-4">💔</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Chưa có gì trong danh sách yêu thích</h2>
              <p className="text-gray-600 mb-6">Khi tìm kiếm khách sạn, nhấn ❤️ để lưu lại nhé!</p>
              <Button type="primary" size="large" onClick={() => navigate('/search')} className="font-bold">
                Tìm kiếm khách sạn
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-5">
                <span className="font-bold text-base text-gray-900">{hotels.length} khách sạn yêu thích</span>
                <Button icon={<DeleteOutlined />} danger onClick={clearAll} size="small">
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
