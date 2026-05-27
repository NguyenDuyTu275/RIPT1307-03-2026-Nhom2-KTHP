import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Skeleton, Tag, Button, Divider, Empty } from 'antd';
import {
  EnvironmentOutlined,
  WifiOutlined, CarOutlined, CoffeeOutlined,
  CheckCircleOutlined, HeartOutlined, HeartFilled,
  LeftOutlined, ShareAltOutlined,
} from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getHotelImage } from '../components/HotelCard';
import { hotelApi } from '../api';
import { transformImageUrl } from '../utils/imageUtils';

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

const NAV_TABS = ['Tổng quan', 'Thông tin & giá', 'Tiện nghi', 'Quy tắc chung', 'Đánh giá của khách'];

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tổng quan');
  const [wished, setWished] = useState(() => {
    try {
      const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
      return list.includes(Number(id));
    } catch { return false; }
  });
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    hotelApi.getById(Number(id))
      .then(res => setHotel(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Collect all images from rooms
  const allImages = useMemo(() => {
    if (!hotel) return [];
    const imgs: string[] = [];
    if (hotel.imageUrl) imgs.push(transformImageUrl(hotel.imageUrl) as string);
    hotel.rooms?.forEach((room: any) => {
      room.images?.forEach((img: any) => {
        if (img.imageUrl) {
          const tUrl = transformImageUrl(img.imageUrl) as string;
          if (!imgs.includes(tUrl)) imgs.push(tUrl);
        }
      });
    });
    return imgs;
  }, [hotel]);

  const toggleWish = () => {
    const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const next = wished ? list.filter((w: number) => w !== Number(id)) : [...list, Number(id)];
    localStorage.setItem('wishlist', JSON.stringify(next));
    setWished(!wished);
  };

  if (loading) return (
    <div className="page-wrapper">
      <Header showSearch />
      <div className="container" style={{ padding: '24px' }}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    </div>
  );

  if (!hotel) return (
    <div className="page-wrapper">
      <Header showSearch />
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: 48 }}>🏨</div>
        <h2 style={{ marginTop: 12 }}>Không tìm thấy khách sạn</h2>
        <Button type="primary" style={{ marginTop: 12 }} onClick={() => navigate('/search')}>
          Quay lại tìm kiếm
        </Button>
      </div>
      <Footer />
    </div>
  );

  const hotelName = hotel.name || 'Khách sạn';
  const basePrice: number | null = hotel.rooms?.[0]?.pricePerNight ?? null;
  const rating = hotel.ratingAvg ? hotel.ratingAvg.toFixed(1) : null;
  const ratingLabel = hotel.ratingAvg
    ? (hotel.ratingAvg >= 9 ? 'Xuất sắc' : hotel.ratingAvg >= 8 ? 'Rất tốt' : hotel.ratingAvg >= 7 ? 'Tốt' : 'Ổn')
    : null;

  return (
    <div className="page-wrapper">
      <Header showSearch />

      {/* ── Breadcrumb + Back ── */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '10px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#595959' }}>
            <span style={{ cursor: 'pointer', color: '#006ce4' }} onClick={() => navigate('/')}>Trang chủ</span>
            <span>›</span>
            <span style={{ cursor: 'pointer', color: '#006ce4' }} onClick={() => navigate('/search')}>Khách sạn</span>
            <span>›</span>
            <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{hotelName}</span>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div style={{ background: '#fff', position: 'sticky', top: 56, zIndex: 100 }}>
        <div className="container">
          <div className="hotel-nav-tabs">
            {NAV_TABS.map(tab => (
              <button
                key={tab}
                className={`hotel-nav-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Title Row ── */}
      <div className="container" style={{ padding: '14px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              {[1,2,3].map(i => (
                <span key={i} style={{ color: '#febb02', fontSize: 14 }}>★</span>
              ))}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1.3 }}>{hotelName}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              <span 
                style={{ fontSize: 13, color: '#006ce4', cursor: 'pointer' }}
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotelName} ${hotel.address || ''} ${hotel.city || ''}`)}`, '_blank')}
              >
                <EnvironmentOutlined style={{ marginRight: 3 }} />
                {hotel.city || hotel.address || 'Việt Nam'} – <span style={{ textDecoration: 'underline' }}>Vị trí xuất sắc - hiển thị bản đồ</span>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexShrink: 0 }}>
            <Button
              icon={wished ? <HeartFilled style={{ color: '#d4111e' }} /> : <HeartOutlined />}
              onClick={toggleWish}
              size="large"
            />
            <Button icon={<ShareAltOutlined />} size="large" />
            <Button
              type="primary"
              size="large"
              style={{ fontWeight: 700, height: 40 }}
              onClick={() => navigate(`/booking/${id}/guest`)}
            >
              Đặt ngay
            </Button>
          </div>
        </div>
      </div>

      {/* ── Photo Gallery + Rating Sidebar ── */}
      <div className="container" style={{ padding: '12px 24px 0' }}>
        <Row gutter={12}>
          <Col xs={24} md={17}>
            {allImages.length > 0 ? (
              <div className="hotel-gallery">
                {allImages.slice(0, 5).map((img, i) => (
                  <div key={i} className={i === 0 ? 'hotel-gallery-main' : ''} style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={img}
                      alt={`${hotelName} ${i + 1}`}
                      className="hotel-gallery-img"
                      onClick={() => setPreviewIndex(i)}
                      referrerPolicy="no-referrer"
                    />
                    {i === 4 && allImages.length > 5 && (
                      <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 18, fontWeight: 700, pointerEvents: 'none'
                      }}>
                        +{allImages.length - 5} ảnh
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: '#f0f0f0', borderRadius: 4, height: 403, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>
                🏨
              </div>
            )}
          </Col>

          {/* Rating Sidebar */}
          <Col xs={24} md={7}>
            <div className="rating-box">
              <div className="rating-box-header">
                <div>
                  <div className="rating-box-label">{ratingLabel || 'Chưa đánh giá'}</div>
                  <div className="rating-box-count" style={{ marginTop: 2 }}>Đánh giá từ khách lưu trú</div>
                </div>
                <div className="rating-box-score">{rating || 'N/A'}</div>
              </div>
              <Divider style={{ margin: '10px 0' }} />
              <div style={{ fontSize: 13, color: '#595959', lineHeight: 1.7 }}>
                <div>· Vị trí thuận lợi, gần trung tâm</div>
                <div>· Nhân viên thân thiện và nhiệt tình</div>
                <div>· Phòng sạch sẽ, tiện nghi đầy đủ</div>
              </div>
              <Divider style={{ margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>Nhân viên phục vụ</span>
                <span className="rating-box-score" style={{ fontSize: 12, padding: '3px 6px' }}>{rating || '—'}</span>
              </div>
            </div>

            {/* Mini map placeholder */}
            <div style={{
              borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border)',
              height: 140, background: 'linear-gradient(135deg, #e8f0fe, #d1e3ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4
            }}>
              <EnvironmentOutlined style={{ fontSize: 24, color: '#006ce4' }} />
              <Button 
                type="primary" 
                size="small" 
                style={{ fontSize: 12 }}
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotelName} ${hotel.address || ''} ${hotel.city || ''}`)}`, '_blank')}
              >
                Xem trên bản đồ
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* ── Thumbnail strip ── */}
      {allImages.length > 1 && (
        <div className="container" style={{ padding: '8px 24px 16px' }}>
          <div className="thumbnail-strip" style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
            {allImages.slice(0, 6).map((img, i) => (
              <div key={i} style={{ width: 100, height: 72, flexShrink: 0, borderRadius: 3, overflow: 'hidden', position: 'relative', cursor: 'pointer' }} onClick={() => setPreviewIndex(i)}>
                <img src={img} alt="" className="hotel-thumbnail-img" referrerPolicy="no-referrer" />
                {i === 5 && allImages.length > 6 && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 13, fontWeight: 600, pointerEvents: 'none'
                  }}>
                    +{allImages.length - 6} ảnh
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="container" style={{ padding: '0 24px 48px' }}>
        <Row gutter={20}>
          {/* Left */}
          <Col xs={24} md={17}>

            {/* Overview */}
            <div style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 4, padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>Giới thiệu</h3>
              <p style={{ color: '#595959', lineHeight: 1.8, margin: 0, fontSize: 14 }}>
                {hotel.description || `${hotelName} là khách sạn cao cấp tại ${hotel.city || 'Việt Nam'}, mang đến trải nghiệm lưu trú sang trọng và tiện nghi hiện đại. Với đội ngũ nhân viên chuyên nghiệp, nhiệt tình, chúng tôi cam kết mang lại kỳ nghỉ tuyệt vời nhất cho quý khách.`}
              </p>
            </div>

            {/* Rooms & Prices */}
            {hotel.rooms && hotel.rooms.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 4, padding: 20, marginBottom: 16 }}>
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>🛏️ Phòng trống</h3>
                {hotel.rooms.map((room: any) => {
                  const roomImg = room.images?.[0]?.imageUrl;
                  return (
                    <div key={room.id} style={{
                      display: 'flex', gap: 14, padding: '12px 0',
                      borderBottom: '1px solid #f0f0f0', alignItems: 'center'
                    }}>
                      <div style={{ width: 90, height: 64, borderRadius: 4, overflow: 'hidden', flexShrink: 0, background: '#f0f0f0' }}>
                        {roomImg ? (
                          <img src={transformImageUrl(roomImg)} alt={room.name} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🛏️</div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#006ce4', marginBottom: 2 }}>{room.name}</div>
                        <div style={{ fontSize: 12, color: '#595959' }}>
                          {room.type && <Tag style={{ fontSize: 11 }}>{room.type}</Tag>}
                          {room.capacity && <span>👥 {room.capacity} khách</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>{room.pricePerNight?.toLocaleString('vi-VN')}₫</div>
                        <div style={{ fontSize: 11, color: '#595959' }}>mỗi đêm</div>
                      </div>
                      <Button type="primary" size="small" onClick={() => navigate(`/booking/${id}/guest`)}>
                        Đặt
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Amenities */}
            <div style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 4, padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>🎯 Tiện nghi nổi bật</h3>
              <Row gutter={[10, 10]}>
                {AMENITIES.map((a) => (
                  <Col key={a.label} xs={12} sm={8}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      <CheckCircleOutlined style={{ color: '#008234' }} />
                      <span>{a.label}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Policies */}
            <div style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 4, padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>📋 Quy tắc chung</h3>
              {[
                ['Nhận phòng', 'Từ 14:00'],
                ['Trả phòng', 'Trước 12:00'],
                ['Hủy phòng', 'Miễn phí trước 24 giờ'],
                ['Trẻ em', 'Được phép (liên hệ khách sạn)'],
                ['Vật nuôi', 'Không được phép'],
                ['Thanh toán', 'Tiền mặt & Thẻ ngân hàng'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f5f5f5', fontSize: 13 }}>
                  <span style={{ color: '#595959' }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Reviews */}
            <div style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 4, padding: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>⭐ Đánh giá của khách</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ background: '#003b95', color: '#fff', borderRadius: '8px 8px 8px 0', padding: '10px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{rating ?? 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{ratingLabel ?? 'Chưa đánh giá'}</div>
                  <div style={{ fontSize: 13, color: '#595959' }}>Dựa trên đánh giá từ khách đã lưu trú</div>
                </div>
              </div>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ color: '#8c8c8c', fontSize: 13 }}>
                    Chưa có đánh giá nào. Hãy là người đầu tiên!
                  </span>
                }
              />
            </div>
          </Col>

          {/* Right — Sticky CTA */}
          <Col xs={24} md={7}>
            <div className="hotel-sticky-cta">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span className="rating-box-score">{rating ?? 'N/A'}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{ratingLabel ?? 'Chưa đánh giá'}</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>Đánh giá chung</div>
                </div>
              </div>

              <Divider style={{ margin: '10px 0' }} />

              <div className="hotel-cta-price">
                {basePrice !== null ? `${basePrice.toLocaleString('vi-VN')}₫` : 'Liên hệ'}
              </div>
              <div className="hotel-cta-label">mỗi đêm · đã bao gồm thuế và phí</div>

              <div style={{ background: '#f5f5f5', borderRadius: 4, padding: 10, margin: '10px 0', fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
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
                style={{ height: 44, fontSize: 15, fontWeight: 700 }}
                onClick={() => navigate(`/booking/${id}/guest`)}
              >
                Đặt ngay
              </Button>

              <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#008234' }}>
                ✓ Không mất phí đặt phòng · Hủy miễn phí
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <div style={{ fontSize: 12, color: '#595959' }}>
                <div style={{ marginBottom: 4 }}>🏨 {hotelName}</div>
                <div style={{ marginBottom: 4 }}>📍 {hotel.city || hotel.address || 'Việt Nam'}</div>
                <div>⭐ {rating ? `${rating}/10` : 'Chưa đánh giá'}</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* ── Custom Lightbox ── */}
      {previewIndex !== null && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div 
            style={{ position: 'absolute', top: 20, right: 24, cursor: 'pointer', color: '#fff', fontSize: 44, zIndex: 10, padding: 10, lineHeight: 1 }}
            onClick={() => setPreviewIndex(null)}
          >
            ×
          </div>
          <div 
            style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#fff', fontSize: 40, zIndex: 10, padding: 20 }}
            onClick={(e) => { e.stopPropagation(); setPreviewIndex((prev) => (prev! > 0 ? prev! - 1 : allImages.length - 1)); }}
          >
            <LeftOutlined />
          </div>
          
          <img 
            src={allImages[previewIndex]} 
            alt="" 
            style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }} 
            referrerPolicy="no-referrer"
          />
          
          <div 
            style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#fff', fontSize: 40, zIndex: 10, padding: 20 }}
            onClick={(e) => { e.stopPropagation(); setPreviewIndex((prev) => (prev! < allImages.length - 1 ? prev! + 1 : 0)); }}
          >
            <LeftOutlined style={{ transform: 'rotate(180deg)' }} />
          </div>
          <div style={{ position: 'absolute', bottom: 20, color: '#fff', fontSize: 16, fontWeight: 500 }}>
            {previewIndex + 1} / {allImages.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HotelDetailPage;
