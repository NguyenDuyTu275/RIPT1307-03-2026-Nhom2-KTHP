import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Row, Col, Slider, Checkbox, Select, Skeleton, Empty } from 'antd';
import { FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchWidget from '../components/SearchWidget';
import HotelCard, { getHotelImage } from '../components/HotelCard';
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
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
        const r = h.ratingAvg || 0;
        return selectedRatings.some(sel => r >= sel);
      });
    }

    // Filter by price range
    result = result.filter(h => {
      const price = h.rooms?.[0]?.pricePerNight ?? 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by property type / features (using simple keyword matching)
    if (selectedTypes.length > 0) {
      result = result.filter(h => {
        const textToSearch = `${h.name} ${h.description}`.toLowerCase();
        return selectedTypes.some(type => textToSearch.includes(type.toLowerCase()));
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
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#006ce4', fontSize: 14, fontWeight: 600,
              padding: '12px 0 0',
            }}
          >
            ← Quay lại trang chủ
          </button>
          <div className="search-results">
            {/* ── FILTER SIDEBAR ── */}
            <aside className="filter-sidebar">
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
                }}
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city || 'Việt Nam')}`, '_blank')}
              >
                <button style={{ 
                    fontSize: 14, fontWeight: 700, borderRadius: 4, 
                    padding: '0 16px', height: 36, background: '#006ce4', color: '#fff',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  📍 Xem trên bản đồ
                </button>
              </div>

              {/* Main Filter Card */}
              <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1a1a1a' }}>Chọn lọc theo:</h3>
                </div>

                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#1a1a1a' }}>Dùng các bộ lọc cũ</div>
                  {[
                    { label: 'Nhà nghỉ mát', keyword: 'nhà nghỉ mát' },
                    { label: 'Chỗ nghỉ nhà dân', keyword: 'nhà dân' },
                    { label: 'Nhà nghỉ nông thôn', keyword: 'nông thôn' },
                    { label: 'Căn hộ', keyword: 'căn hộ' },
                    { label: 'Biệt thự', keyword: 'biệt thự' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                      <Checkbox 
                        checked={selectedTypes.includes(item.keyword)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedTypes([...selectedTypes, item.keyword]);
                          else setSelectedTypes(selectedTypes.filter(t => t !== item.keyword));
                        }}
                      >
                        <span style={{ fontSize: 14, color: '#333' }}>{item.label}</span>
                      </Checkbox>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: '#1a1a1a' }}>Ngân sách của bạn (mỗi đêm)</div>
                  <div style={{ fontSize: 13, marginBottom: 16, color: '#333' }}>
                    VND {priceRange[0].toLocaleString('vi-VN')} - VND {priceRange[1].toLocaleString('vi-VN')}{priceRange[1] === 10000000 ? '+' : ''}
                  </div>
                  
                  {/* Histogram Chart */}
                  <div style={{ height: 40, display: 'flex', alignItems: 'flex-end', gap: '2px', padding: '0 10px', marginBottom: -10 }}>
                    {[1, 2, 1, 9, 4, 3, 5, 2, 1, 2, 1, 2, 1, 1, 2, 1, 1, 0, 1, 0, 0].map((h, i) => (
                      <div key={i} style={{ flex: 1, background: '#e0e0e0', height: `${h * 10}%`, borderRadius: '2px 2px 0 0' }}></div>
                    ))}
                  </div>
                  <Slider 
                    range 
                    min={0}
                    max={10000000}
                    step={100000}
                    value={[priceRange[0], priceRange[1]]}
                    onChange={(val) => setPriceRange([val[0], val[1]])}
                    tooltip={{ formatter: null }} 
                    trackStyle={[{ backgroundColor: '#006ce4', height: 4 }]}
                    handleStyle={[
                      { borderColor: '#006ce4', backgroundColor: '#006ce4', width: 18, height: 18, marginTop: -7 },
                      { borderColor: '#006ce4', backgroundColor: '#006ce4', width: 18, height: 18, marginTop: -7 }
                    ]}
                  />
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#1a1a1a' }}>Các bộ lọc phổ biến</div>
                  {[
                    { label: 'Khách sạn', keyword: 'khách sạn' },
                    { label: 'Bao gồm bữa sáng', keyword: 'bữa sáng' },
                    { label: 'Đặt phòng không cần thẻ tín dụng', keyword: 'thẻ tín dụng' },
                    { label: 'Giáp biển', keyword: 'biển' },
                    { label: 'Căn hộ', keyword: 'căn hộ' },
                    { label: 'Rất tốt: 8 điểm trở lên', sub: 'Dựa trên đánh giá của khách', val: 8 },
                    { label: 'Resort', keyword: 'resort' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, alignItems: 'flex-start' }}>
                      <Checkbox 
                        checked={item.val ? selectedRatings.includes(item.val) : selectedTypes.includes(item.keyword!)}
                        onChange={(e) => {
                          if (item.val) {
                            if (e.target.checked) setSelectedRatings([...selectedRatings, item.val]);
                            else setSelectedRatings(selectedRatings.filter(r => r !== item.val));
                          } else if (item.keyword) {
                            if (e.target.checked) setSelectedTypes([...selectedTypes, item.keyword]);
                            else setSelectedTypes(selectedTypes.filter(t => t !== item.keyword));
                          }
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 14, color: '#333' }}>{item.label}</div>
                          {item.sub && <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>{item.sub}</div>}
                        </div>
                      </Checkbox>
                    </div>
                  ))}
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
                    {(() => {
                      const imgUrl = getHotelImage(hotel);
                      return imgUrl ? (
                        <img
                          className="hotel-result-img"
                          src={imgUrl}
                          alt={hotel.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
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
                      );
                    })()}
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
