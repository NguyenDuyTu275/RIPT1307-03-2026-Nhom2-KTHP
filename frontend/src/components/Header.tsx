import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover, Badge, List, Typography, Spin } from 'antd';
import { BellOutlined, DeleteOutlined, SyncOutlined, CheckOutlined, DownOutlined } from '@ant-design/icons';
import { useWishlist } from '../context/WishlistContext';
import { notificationApi } from '../api';

const { Text } = Typography;

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

  // State thông báo
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    if (!token) return;
    setLoadingNotifications(true);
    try {
      const res = await notificationApi.getMy();
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      // Gọi API mỗi phút một lần
      const intervalId = setInterval(fetchNotifications, 60000);
      return () => clearInterval(intervalId);
    }
  }, [token]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleReadNotification = async (notification: any) => {
    if (notification.isRead) return;
    try {
      await notificationApi.markAsRead(notification.id);
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Lỗi khi đánh dấu thông báo đã đọc', error);
    }
  };

  const handleDeleteNotification = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài (không trigger handleReadNotification)
    try {
      await notificationApi.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa thông báo', error);
    }
  };

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

  const timeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days === 1) return `một ngày trước`;
    if (days > 1) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `vừa xong`;
  };

  const notificationContent = (
    <div style={{ width: 360, maxHeight: 500, overflowY: 'auto', padding: 0 }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <b style={{ fontSize: 15, color: '#333' }}>Thông báo của tôi ({notifications.length})</b>
        <div style={{ display: 'flex', gap: 12, fontSize: 18, color: '#003b95' }}>
          <SyncOutlined style={{ cursor: 'pointer' }} onClick={fetchNotifications} spin={loadingNotifications} />
          <CheckOutlined 
            style={{ cursor: 'pointer' }} 
            onClick={async () => {
              for (const n of notifications.filter(x => !x.isRead)) {
                await handleReadNotification(n);
              }
            }} 
          />
        </div>
      </div>
      {loadingNotifications && notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20 }}><Spin /></div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20, color: '#888' }}>Không có thông báo nào</div>
      ) : (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item 
              style={{ 
                cursor: 'pointer', 
                background: item.isRead ? '#fff' : '#f4f9fd',
                padding: '16px 16px',
                borderBottom: '1px solid #e8e8e8',
                position: 'relative'
              }}
              onClick={() => handleReadNotification(item)}
            >
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingRight: 28 }}>
                  <Text strong style={{ color: '#c00000', fontSize: 14, lineHeight: 1.4 }}>{item.title}</Text>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic', color: '#b3b3b3' }}>
                      {timeAgo(item.createdAt)}
                    </Text>
                  </div>
                </div>
                <DeleteOutlined 
                  onClick={(e) => handleDeleteNotification(e, item.id)}
                  style={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16, 
                    color: '#999', 
                    fontSize: 16,
                    padding: 4,
                    cursor: 'pointer'
                  }} 
                  title="Xóa thông báo"
                />
              </List.Item>
          )}
        />
      )}
      {notifications.length > 0 && (
        <div style={{ padding: '12px', textAlign: 'center', color: '#c00000', cursor: 'pointer', fontSize: 14 }}>
          <DownOutlined style={{ marginRight: 4 }} /> Tải thêm
        </div>
      )}
    </div>
  );

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
      
      {/* Hiện menu Admin trên mobile */}
      {isAdmin && (
        <div className="bk-popover-item mobile-only-flex" onClick={() => navigate('/admin')} style={{ fontWeight: 700, color: '#006ce4' }}>
          Quản lý Admin
        </div>
      )}

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
                    className="bk-header-action-btn hide-on-mobile"
                    onClick={() => navigate('/admin')}
                    style={{ fontWeight: 600 }}
                  >
                    Quản lý Admin
                  </button>
                )}
                
                <button
                  className="bk-header-action-btn hide-on-mobile"
                  onClick={() => navigate('/my-bookings')}
                >
                  Đặt chỗ của tôi
                </button>

                <Popover
                  content={notificationContent}
                  trigger="click"
                  placement="bottomRight"
                  open={showNotifications}
                  onOpenChange={setShowNotifications}
                  overlayInnerStyle={{ borderRadius: 12, padding: 8 }}
                >
                  <button className="bk-header-action-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                      <BellOutlined style={{ color: '#fff', fontSize: 20 }} />
                    </Badge>
                  </button>
                </Popover>

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
                    <div className="bk-avatar-name hide-on-mobile">{username}</div>
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
