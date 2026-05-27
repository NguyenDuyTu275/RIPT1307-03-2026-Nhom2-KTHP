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
    rooms?: { pricePerNight?: number; images?: { imageUrl?: string }[] }[];
  };
  onClick?: () => void;
  wished?: boolean;
  onWishToggle?: () => void;
  showPrice?: boolean;
  estimatedPrice?: number;
}

/**
 * Lấy URL ảnh đại diện cho hotel.
 * Ưu tiên: hotel.imageUrl → rooms[0].images[0].imageUrl → null
 */
export function getHotelImage(hotel: any): string | null {
  let url = null;
  if (hotel?.imageUrl) {
    url = hotel.imageUrl;
  } else {
    // Fallback: lấy ảnh từ phòng đầu tiên
    const rooms = hotel?.rooms;
    if (rooms && rooms.length > 0) {
      for (const room of rooms) {
        if (room.images && room.images.length > 0 && room.images[0].imageUrl) {
          url = room.images[0].imageUrl;
          break;
        }
      }
    }
  }

  // Chuyển đổi link Google Drive nếu có để tránh lỗi 403 / bị chặn
  if (url && url.includes('drive.google.com')) {
    const match = url.match(/id=([^&]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
  }
  return url;
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
  const imgUrl = getHotelImage(hotel);

  const ratingLabel = rating === null ? 'Chưa đánh giá' : rating >= 9 ? 'Tuyệt vời' : rating >= 8 ? 'Rất tốt' : rating >= 7 ? 'Tốt' : 'Ổn';

  const [imageError, setImageError] = React.useState(false);

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
      {imgUrl && !imageError ? (
        <img
          className="hotel-card-img"
          src={imgUrl}
          alt={hotel.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className="hotel-card-img hotel-card-img-fallback"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, background: 'linear-gradient(135deg, #e8f0fe, #f0f0f0)'
          }}
        >
          🏨
        </div>
      )}

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
