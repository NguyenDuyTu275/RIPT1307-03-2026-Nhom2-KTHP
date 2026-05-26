import React from 'react';

interface HotelCardProps {
  hotel: {
    id: number | string;
    name: string;
    city?: string;
    address?: string;
    ratingAvg?: number;
    description?: string;
    status?: string;
    imageUrl?: string;
    rooms?: { pricePerNight?: number }[];
  };
  onClick?: () => void;
  wished?: boolean;
  onWishToggle?: () => void;
  showPrice?: boolean;
  estimatedPrice?: number;
}

const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  onClick,
  wished = false,
  onWishToggle,
  showPrice = true,
  estimatedPrice,
}) => {
  const rating = hotel.ratingAvg ?? null;
  // Lấy giá từ phòng đầu tiên (backend trả rooms[] kèm theo hotel)
  const price = estimatedPrice ?? hotel.rooms?.[0]?.pricePerNight ?? null;

  const ratingLabel = rating === null ? 'Chưa đánh giá' : rating >= 9 ? 'Tuyệt vời' : rating >= 8 ? 'Rất tốt' : rating >= 7 ? 'Tốt' : 'Ổn';

  return (
    <div className="hotel-card" onClick={onClick} style={{ position: 'relative' }}>
      {/* Wishlist button */}
      {onWishToggle && (
        <button
          className={`wishlist-btn ${wished ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onWishToggle(); }}
        >
          {wished ? '❤️' : '🤍'}
        </button>
      )}

      {/* Image — hiển thị ảnh thật nếu có, fallback gradient */}
      {hotel.imageUrl ? (
        <img
          className="hotel-card-img"
          src={hotel.imageUrl}
          alt={hotel.name}
          loading="lazy"
          onError={(e) => {
            // Fallback khi ảnh lỗi
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement?.querySelector('.hotel-card-img-fallback')?.removeAttribute('style');
          }}
        />
      ) : null}
      <div
        className="hotel-card-img hotel-card-img-fallback"
        style={hotel.imageUrl ? { display: 'none' } : {
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 48, background: 'linear-gradient(135deg, #e8f0fe, #f0f0f0)'
        }}
      >
        🏨
      </div>

      {/* Body */}
      <div className="hotel-card-body">
        <div className="hotel-card-name">{hotel.name}</div>
        <div className="hotel-card-city">
          📍 {hotel.city || hotel.address || 'Việt Nam'}
        </div>

        <div className="hotel-card-footer">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="rating-badge">{rating !== null ? rating.toFixed(1) : 'N/A'}</span>
              <span className="rating-text">{ratingLabel}</span>
            </div>
          </div>
          {showPrice && (
            <div className="hotel-card-price">
              <div className="hotel-card-price-amount">
                {price !== null ? price.toLocaleString('vi-VN') + '₫' : 'Liên hệ'}
              </div>
              <div className="hotel-card-price-label">mỗi đêm</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
