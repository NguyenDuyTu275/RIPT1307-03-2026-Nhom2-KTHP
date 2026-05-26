import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Row, Col, Slider, Checkbox, Select, Skeleton, Empty } from 'antd';
import { FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchWidget from '../components/SearchWidget';
import { getHotelImage } from '../components/HotelCard';
import { hotelApi } from '../api';

const { Option } = Select;

const SearchResults: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const city = searchParams.get('city') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '2';

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    setLoading(true);
    hotelApi.getAll()
      .then(res => setHotels(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...hotels];

    // Filter by city
    if (city) {
      result = result.filter(h =>
        h.city?.toLowerCase().includes(city.toLowerCase()) ||
        h.name?.toLowerCase().includes(city.toLowerCase()) ||
        h.address?.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Filter by rating
    if (selectedRatings.length > 0) {
      result = result.filter(h => {
        const r = h.ratingAvg || 7;
        return selectedRatings.some(sel => r >= sel);
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'rating') return (b.ratingAvg || 0) - (a.ratingAvg || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [hotels, city, selectedRatings, sortBy]);

  const toggleWish = (id: number) => {
    const next = wishlist.includes(id) ? wishlist.filter(w => w !== id) : [...wishlist, id];
    setWishlist(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
  };

  return (
    <div className="page-wrapper">
      <Header />

      {/* Search bar strip */}
      <div style={{ background: '#003b95', padding: '16px 0' }}>
        <div className="container">
          <SearchWidget
            initialCity={city}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialGuests={Number(guests)}
          />
        </div>
      </div>

      <div style={{ background: '#f5f5f5', flex: 1 }}>
        <div className="container">
          <div className="search-results">
            {/* ── FILTER SIDEBAR ── */}
            <aside className="filter-sidebar">
              <div className="filter-card">
                <div className="filter-title">🎯 Lọc theo</div>

                {/* Rating filter */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: '#595959' }}>Điểm đánh giá</div>
                  {[
                    { label: 'Tuyệt vời: 9+', val: 9 },
                    { label: 'Rất tốt: 8+', val: 8 },
                    { label: 'Tốt: 7+', val: 7 },
                  ].map(({ label, val }) => (
                    <div key={val} style={{ marginBottom: 8 }}>
                      <Checkbox
                        checked={selectedRatings.includes(val)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedRatings([...selectedRatings, val]);
                          else setSelectedRatings(selectedRatings.filter(r => r !== val));
                        }}
                      >
                        <span style={{ fontSize: 13 }}>{label}</span>
                      </Checkbox>
                    </div>
                  ))}
                </div>

                {/* Status filter */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: '#595959' }}>Trạng thái</div>
                  <Checkbox defaultChecked><span style={{ fontSize: 13 }}>Còn phòng</span></Checkbox>
                </div>
              </div>
            </aside>

            {/* ── RESULTS ── */}
            <div className="results-list">
              <div className="results-header">
                <div>
                  <div className="results-count">
                    {city ? `${city}: ` : ''}{filtered.length} chỗ nghỉ tìm thấy
                  </div>
                  {(checkIn && checkOut) && (
                    <div style={{ fontSize: 14, color: '#595959', marginTop: 4 }}>
                      {checkIn} → {checkOut} · {guests} khách
                    </div>
                  )}
                </div>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 180 }}
                  prefix={<SortAscendingOutlined />}
                >
                  <Option value="rating">Đánh giá cao nhất</Option>
                  <Option value="name">Tên A → Z</Option>
                </Select>
              </div>

              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="hotel-result-card" style={{ padding: 16, pointerEvents: 'none' }}>
                    <Skeleton active avatar={{ shape: 'square', size: 200 }} paragraph={{ rows: 3 }} />
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 8, padding: '80px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>Không tìm thấy chỗ nghỉ nào</div>
                        <div style={{ color: '#595959', fontSize: 15 }}>Vui lòng thử thay đổi bộ lọc hoặc tìm kiếm với địa điểm khác.</div>
                      </div>
                    }
                  />
                </div>
              ) : (
                filtered.map((hotel) => {
                  const price = hotel.rooms?.[0]?.pricePerNight ?? null;
                  const rating = hotel.ratingAvg ?? null;
                  const ratingLabel = rating === null ? '' : rating >= 9 ? 'Tuyệt vời' : rating >= 8 ? 'Rất tốt' : 'Tốt';

                  return (
                    <div
                      key={hotel.id}
                      className="hotel-result-card"
                      onClick={() => navigate(`/hotels/${hotel.id}`)}
                    >
                      {hotel.imageUrl ? (
                        <img
                          className="hotel-result-img"
                          src={hotel.imageUrl}
                          alt={hotel.name}
                          loading="lazy"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div
                          className="hotel-result-img"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, background: 'linear-gradient(135deg, #e8f0fe, #f0f0f0)' }}
                        >
                          🏨
                        </div>
                      )}
                      <div className="hotel-result-body">
                        <div className="hotel-result-info">
                          <div className="hotel-result-name">{hotel.name}</div>
                          <div className="hotel-result-city">📍 {hotel.city || hotel.address || 'Việt Nam'}</div>
                          <div className="hotel-result-desc">{hotel.description || 'Khách sạn cao cấp với đầy đủ tiện nghi, phù hợp cho cả du lịch công tác và nghỉ dưỡng.'}</div>

                          <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 12, color: '#008234', background: '#e6f5ea', padding: '2px 8px', borderRadius: 12 }}>✓ Miễn phí hủy phòng</span>
                            <span style={{ fontSize: 12, color: '#006ce4', background: '#e8f0fe', padding: '2px 8px', borderRadius: 12 }}>✓ Thanh toán tại khách sạn</span>
                          </div>
                        </div>

                        <div className="hotel-result-pricing">
                          <div>
                             <span className="rating-badge" style={{ fontSize: 14 }}>{rating !== null ? rating.toFixed(1) : 'N/A'}</span>
                             <div style={{ fontSize: 12, color: '#595959', marginTop: 4 }}>{ratingLabel || 'Chưa đánh giá'}</div>
                          </div>
                          <div>
                           <div className="hotel-result-price">{price !== null ? price.toLocaleString('vi-VN') + '₫' : 'Liên hệ để biết giá'}</div>
                            <div className="hotel-result-price-label">mỗi đêm, đã bao gồm thuế</div>
                            <button
                              className="hotel-result-cta"
                              style={{ marginTop: 8, padding: '8px 16px', borderRadius: 4, cursor: 'pointer', background: '#006ce4', color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, width: '100%' }}
                              onClick={(e) => { e.stopPropagation(); navigate(`/hotels/${hotel.id}`); }}
                            >
                              Xem phòng trống
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
