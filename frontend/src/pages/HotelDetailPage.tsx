import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Skeleton, Tag, Button, Divider, Empty, Input, message, Modal } from 'antd';
import {
  EnvironmentOutlined,
  WifiOutlined, CarOutlined, CoffeeOutlined,
  CheckCircleOutlined, HeartOutlined, HeartFilled,
  LeftOutlined, ShareAltOutlined, StarFilled,
  UserOutlined, DeleteOutlined, SendOutlined,
  StarOutlined,
} from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getHotelImage } from '../components/HotelCard';
import { hotelApi, reviewApi } from '../api';
import { useWishlist } from '../context/WishlistContext';
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

/* ── Star Rating Component ── */
const StarRating = ({
  value,
  hover,
  onChange,
  onHover,
  onLeave,
  size = 28,
  count = 10,
  readonly = false,
}: {
  value: number;
  hover?: number;
  onChange?: (v: number) => void;
  onHover?: (v: number) => void;
  onLeave?: () => void;
  size?: number;
  count?: number;
  readonly?: boolean;
}) => {
  const active = hover || value;
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: count }, (_, i) => i + 1).map(star => (
        <span
          key={star}
          style={{
            cursor: readonly ? 'default' : 'pointer',
            fontSize: size,
            color: star <= active ? '#febb02' : '#d9d9d9',
            transition: 'color 0.15s, transform 0.15s',
            transform: !readonly && star <= (hover || 0) ? 'scale(1.15)' : 'scale(1)',
            lineHeight: 1,
          }}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && onHover?.(star)}
          onMouseLeave={() => !readonly && onLeave?.()}
        >
          <StarFilled />
        </span>
      ))}
    </div>
  );
};

/* ── Rating Label Helper ── */
const getRatingLabel = (score: number) => {
  if (score >= 9) return 'Xuất sắc';
  if (score >= 8) return 'Rất tốt';
  if (score >= 7) return 'Tốt';
  if (score >= 5) return 'Ổn';
  return 'Trung bình';
};

const getRatingColor = (score: number) => {
  if (score >= 9) return '#008234';
  if (score >= 7) return '#006ce4';
  if (score >= 5) return '#f56600';
  return '#d4111e';
};

/* ── Format Time ── */
const formatTimeAgo = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return d.toLocaleDateString('vi-VN');
};

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tổng quan');
  const { isInWishlist, toggleWish } = useWishlist();
  const wished = isInWishlist(Number(id));
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // ── Review state ──
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');
  const currentUsername = useMemo(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.username || null;
    } catch { return null; }
  }, []);

  // Filter reviews for this hotel
  const reviews = useMemo(() => {
    return allReviews.filter((r: any) => r.hotel?.id === Number(id));
  }, [allReviews, id]);

  // Compute stats from filtered reviews
  const reviewStats = useMemo(() => {
    if (reviews.length === 0) return { avg: null, total: 0 };
    const sum = reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0);
    return { avg: sum / reviews.length, total: reviews.length };
  }, [reviews]);

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    const dist = [
      { label: 'Xuất sắc', range: '9-10', count: 0, color: '#008234' },
      { label: 'Rất tốt', range: '7-8', count: 0, color: '#006ce4' },
      { label: 'Ổn', range: '5-6', count: 0, color: '#f56600' },
      { label: 'Kém', range: '3-4', count: 0, color: '#d4111e' },
      { label: 'Rất kém', range: '1-2', count: 0, color: '#8c0000' },
    ];
    reviews.forEach((r: any) => {
      const s = r.rating;
      if (s >= 9) dist[0].count++;
      else if (s >= 7) dist[1].count++;
      else if (s >= 5) dist[2].count++;
      else if (s >= 3) dist[3].count++;
      else dist[4].count++;
    });
    return dist;
  }, [reviews]);

  const fetchReviews = useCallback(() => {
    reviewApi.getAll()
      .then((res: any) => setAllReviews(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    hotelApi.getById(Number(id))
      .then(res => setHotel(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

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

  const handleSubmitReview = async () => {
    if (!reviewRating) {
      message.warning('Vui lòng chọn điểm đánh giá!');
      return;
    }
    if (!reviewComment.trim()) {
      message.warning('Vui lòng nhập nhận xét!');
      return;
    }

    setSubmittingReview(true);
    try {
      // Parse current user ID from token
      const token = localStorage.getItem('token');
      let userId: number | null = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.userId || payload.id || null;
        } catch { /* ignore */ }
      }

      const reviewData: any = {
        rating: reviewRating,
        comment: reviewComment,
        hotel: { id: Number(id) },
      };

      // If we have userId, include it
      if (userId) {
        reviewData.user = { id: userId };
      }

      await reviewApi.create(reviewData);
      message.success('🎉 Đánh giá của bạn đã được gửi thành công!');
      setReviewRating(0);
      setReviewComment('');
      fetchReviews();
    } catch (e: any) {
      message.error('Gửi đánh giá thất bại! Vui lòng thử lại.');
    } finally {
      setSubmittingReview(false);
    }
  };


  const handleTabClick = (tab: string) => {
    if (tab === 'Đánh giá của khách') {
      navigate(`/hotels/${id}/reviews`);
      return;
    }

    setActiveTab(tab);
    const sectionId = {
      'Tổng quan': 'overview-section',
      'Thông tin & giá': 'rooms-section',
      'Tiện nghi': 'amenities-section',
      'Quy tắc chung': 'policies-section',
    }[tab];
    
    if (sectionId) {
      // Add a slight offset to account for the sticky header
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 110; // Adjust this based on your actual sticky header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
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
  const displayRating = reviewStats.avg ? reviewStats.avg.toFixed(1) : (hotel.ratingAvg ? hotel.ratingAvg.toFixed(1) : null);
  const displayRatingNum = reviewStats.avg ?? hotel.ratingAvg ?? null;
  const ratingLabel = displayRatingNum
    ? getRatingLabel(displayRatingNum)
    : null;

  // Check if current user already reviewed this hotel
  const hasReviewed = reviews.some((r: any) => r.user?.username === currentUsername);

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
                onClick={() => handleTabClick(tab)}
              >
                {tab}
                {tab === 'Đánh giá của khách' && reviewStats.total > 0 && (
                  <span style={{
                    marginLeft: 6, background: '#006ce4', color: '#fff',
                    borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 700,
                  }}>
                    {reviewStats.total}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Title Row ── */}
      <div id="overview-section" className="container" style={{ padding: '14px 24px 0' }}>
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
              onClick={() => toggleWish(Number(id))}
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

          {/* Rating Sidebar & Map */}
          <Col xs={24} md={7}>
            {/* Map Box */}
            <div 
              style={{
                borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0',
                height: 150, marginBottom: 16,
                backgroundImage: 'url(https://cf.bstatic.com/static/img/map/map-entry-point/462d770529d1ffb8580556f8f110c735dbe199e7.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotelName} ${hotel.address || ''} ${hotel.city || ''}`)}`, '_blank')}
            >
              <Button 
                type="primary" 
                icon={<EnvironmentOutlined />}
                style={{ 
                  fontSize: 14, fontWeight: 700, borderRadius: 4, 
                  padding: '0 16px', height: 36, background: '#006ce4',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                Xem trên bản đồ
              </Button>
            </div>

            {/* Rating Box */}
            <div style={{
              background: '#f8f9fa',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a', marginBottom: 2 }}>
                    {ratingLabel || 'Chưa đánh giá'}
                  </div>
                  <div style={{ fontSize: 13, color: '#595959' }}>
                    {reviewStats.total > 0 ? `${reviewStats.total} đánh giá` : 'Đánh giá từ khách'}
                  </div>
                </div>
                <div style={{
                  background: '#003b95', color: '#fff',
                  borderRadius: '6px 6px 6px 0',
                  padding: '6px 10px', fontSize: 16, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {displayRating || '—'}
                </div>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ fontSize: 13, color: '#333', lineHeight: 1.8, marginBottom: 16 }}>
                <div><span style={{ color: '#008234', marginRight: 6 }}>✓</span> Vị trí thuận lợi, gần trung tâm</div>
                <div><span style={{ color: '#008234', marginRight: 6 }}>✓</span> Nhân viên thân thiện và nhiệt tình</div>
                <div><span style={{ color: '#008234', marginRight: 6 }}>✓</span> Phòng sạch sẽ, tiện nghi đầy đủ</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span style={{ fontWeight: 600, color: '#1a1a1a' }}>Nhân viên phục vụ</span>
                <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{displayRating || '—'}</span>
              </div>
              <div style={{ background: '#e2e8f0', height: 4, borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                <div style={{ background: '#003b95', width: `${displayRating ? (Number(displayRating) / 10) * 100 : 0}%`, height: '100%' }}></div>
              </div>
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
              <div id="rooms-section" style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 4, padding: 20, marginBottom: 16 }}>
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
            <div id="amenities-section" style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 4, padding: 20, marginBottom: 16 }}>
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
            <div id="policies-section" style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 4, padding: 20, marginBottom: 16 }}>
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


          </Col>

          {/* Right — Sticky CTA */}
          <Col xs={24} md={7}>
            <div className="hotel-sticky-cta">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span className="rating-box-score">{displayRating ?? 'N/A'}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{ratingLabel ?? 'Chưa đánh giá'}</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                    {reviewStats.total > 0 ? `${reviewStats.total} đánh giá` : 'Đánh giá chung'}
                  </div>
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
                <div>⭐ {displayRating ? `${displayRating}/10` : 'Chưa đánh giá'}</div>
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
