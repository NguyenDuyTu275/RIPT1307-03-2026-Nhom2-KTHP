import React from 'react';

// Pool of high-quality Unsplash hotel images (free to use)
const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c4a49f7c?w=600&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
  'https://images.unsplash.com/photo-1576354302919-96748cb8299e?w=600&q=80',
  'https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80',
  'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=600&q=80',
];

export const getHotelImage = (id: number | string): string => {
  const numId = typeof id === 'string' ? parseInt(id, 10) || 0 : id;
  return HOTEL_IMAGES[numId % HOTEL_IMAGES.length];
};

interface HotelCardProps {
  hotel: {
    id: number | string;
    name: string;
    city?: string;
    address?: string;
    ratingAvg?: number;
    description?: string;
    status?: string;
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
  const imgUrl = getHotelImage(hotel.id);
  const rating = hotel.ratingAvg ?? 8.0 + (Number(hotel.id) % 20) / 10;
  const price = estimatedPrice ?? 500000 + (Number(hotel.id) % 20) * 50000;

  const ratingLabel = rating >= 9 ? 'Tuyệt vời' : rating >= 8 ? 'Rất tốt' : rating >= 7 ? 'Tốt' : 'Ổn';

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

      {/* Image */}
      <img
        src={imgUrl}
        alt={hotel.name}
        className="hotel-card-img"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Body */}
      <div className="hotel-card-body">
        <div className="hotel-card-name">{hotel.name}</div>
        <div className="hotel-card-city">
          📍 {hotel.city || hotel.address || 'Việt Nam'}
        </div>

        <div className="hotel-card-footer">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="rating-badge">{rating.toFixed(1)}</span>
              <span className="rating-text">{ratingLabel}</span>
            </div>
          </div>
          {showPrice && (
            <div className="hotel-card-price">
              <div className="hotel-card-price-amount">
                {price.toLocaleString('vi-VN')}₫
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
