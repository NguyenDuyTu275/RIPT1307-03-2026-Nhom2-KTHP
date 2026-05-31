import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover } from 'antd';
import { useWishlist } from '../context/WishlistContext';

interface HeaderProps {
  showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const isAdmin = localStorage.getItem('role') === 'ADMIN';
  const { wishlist } = useWishlist();

  const [avatarUrl, setAvatarUrl] = useState<string>(
    localStorage.getItem('avatarUrl') || ''
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatarUrl(dataUrl);
      localStorage.setItem('avatarUrl', dataUrl);
    };
    reader.readAsDataURL(file);
  };


  const popoverContent = (
    <div style={{ minWidth: 200 }}>
      {/* Avatar upload inside popover */}
      <div className="bk-popover-avatar-section">
        <div
          className="bk-popover-avatar"
          onClick={() => fileInputRef.current?.click()}
          title="Nhấn để đổi ảnh đại diện"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="bk-popover-avatar-img" />
          ) : (
            <span className="bk-popover-avatar-initial">
              {username?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
          <div className="bk-popover-avatar-overlay">📷</div>
        </div>
        <div className="bk-popover-username">{username}</div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />
      </div>
      <div style={{ borderTop: '1px solid #e7e7e7' }} />
      <div className="bk-popover-item" onClick={() => navigate('/profile')}>Hồ sơ của tôi</div>
      <div className="bk-popover-item" onClick={() => navigate('/my-bookings')}>Lịch sử đặt phòng</div>
      <div className="bk-popover-item" onClick={() => navigate('/wishlist')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Danh sách yêu thích</span>
        {wishlist.length > 0 && (
          <span style={{ background: '#006ce4', color: '#fff', borderRadius: 10, padding: '1px 8px', fontSize: 12, fontWeight: 700 }}>
            {wishlist.length}
          </span>
        )}
      </div>

      <div className="bk-popover-item bk-popover-item-danger" onClick={handleLogout}>
        Đăng xuất
      </div>
    </div>
  );

  return (
    <header className="bk-header">
      {/* Top row */}
      <div className="bk-header-top">
        <div className="bk-header-top-inner">
          {/* Logo */}
          <div className="bk-logo" onClick={() => navigate('/')}>
            Booking<span>.com</span>
          </div>

          {/* Right actions */}
          <div className="bk-header-actions">
            {token ? (
              <>
                {isAdmin && (
                  <button
                    className="bk-header-action-btn"
                    onClick={() => navigate('/admin')}
                    style={{ fontWeight: 600 }}
                  >
                    Quản lý Admin
                  </button>
                )}
                
                <button
                  className="bk-header-action-btn"
                  onClick={() => navigate('/my-bookings')}
                >
                  Đặt chỗ của tôi
                </button>

                <Popover
                  content={popoverContent}
                  trigger="click"
                  placement="bottomRight"
                  overlayInnerStyle={{ padding: 0, borderRadius: 8, overflow: 'hidden' }}
                >
                  <button className="bk-header-user-btn">
                    <div className="bk-avatar">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        username?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <div className="bk-avatar-name">{username}</div>
                  </button>
                </Popover>
              </>
            ) : (
              <>
                <button className="bk-header-action-btn" onClick={() => navigate('/register')}>
                  Đăng ký
                </button>
                <button className="bk-header-signin-btn" onClick={() => navigate('/login')}>
                  Đăng nhập
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
