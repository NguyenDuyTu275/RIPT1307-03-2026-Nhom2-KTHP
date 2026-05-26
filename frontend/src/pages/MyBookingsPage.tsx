import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Button, Tag, Empty, Skeleton, message, Modal } from 'antd';
import { CalendarOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthGuard from '../components/AuthGuard';
import { getHotelImage } from '../components/HotelCard';
import { bookingApi } from '../api';

const statusConfig: Record<string, { label: string; color: string; className: string }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'warning', className: 'status-pending' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'success', className: 'status-confirmed' },
  CANCELLED: { label: 'Đã hủy', color: 'error', className: 'status-cancelled' },
};

const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchBookings = () => {
    setLoading(true);
    bookingApi.getMy()
      .then(res => setBookings(res.data || []))
      .catch(() => message.error('Không thể tải lịch sử đặt phòng!'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = (bookingId: number) => {
    Modal.confirm({
      title: 'Hủy đặt phòng?',
      content: 'Bạn có chắc muốn hủy đặt phòng này không? Thao tác này không thể hoàn tác.',
      okText: 'Xác nhận hủy',
      cancelText: 'Giữ lại',
      okType: 'danger',
      onOk: async () => {
        setCancellingId(bookingId);
        try {
          await bookingApi.cancel(bookingId);
          message.success('Đã hủy đặt phòng thành công!');
          fetchBookings();
        } catch {
          message.error('Hủy đặt phòng thất bại!');
        } finally {
          setCancellingId(null);
        }
      },
    });
  };

  const filtered = bookings.filter(b => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  const BookingCard = ({ booking }: { booking: any }) => {
    const config = statusConfig[booking.status] || statusConfig.PENDING;
    const checkIn = booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('vi-VN') : '—';
    const checkOut = booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString('vi-VN') : '—';
    const hotelId = booking.hotel?.id || booking.hotelId || 1;

    return (
      <div className="booking-card">
        <div className="booking-card-img">
          <div
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, background: 'linear-gradient(135deg, #e8f0fe, #f0f0f0)' }}
          >
            🏨
          </div>
        </div>

        <div className="booking-card-body">
          <div className="booking-card-info">
            <div className="booking-card-name">
              {booking.hotel?.name || 'Khách sạn'}
            </div>
            <div className="booking-card-dates">
              <CalendarOutlined /> {checkIn} → {checkOut}
            </div>
            <div style={{ marginBottom: 8 }}>
              <span className={`status-badge ${config.className}`}>{config.label}</span>
            </div>
            <div style={{ fontSize: 13, color: '#595959' }}>
              📍 {booking.hotel?.city || booking.hotel?.address || 'Việt Nam'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>
                {(booking.totalPrice || 0).toLocaleString('vi-VN')}₫
              </div>
              <div style={{ fontSize: 12, color: '#595959' }}>
                {booking.paymentStatus === 'PAID' ? '✅ Đã thanh toán' : '⏳ Thanh toán tại chỗ'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/my-bookings/${booking.id}`)}
              >
                Xem
              </Button>
              {booking.status === 'PENDING' && (
                <Button
                  size="small"
                  danger
                  icon={<CloseCircleOutlined />}
                  loading={cancellingId === booking.id}
                  onClick={() => handleCancel(booking.id)}
                >
                  Hủy
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AuthGuard>
      <div className="page-wrapper">
        <Header showSearch />

        <div style={{ background: '#003b95', padding: '24px 0' }}>
          <div className="container">
            <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
              Đặt chỗ của tôi
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              Quản lý tất cả các đặt phòng của bạn
            </p>
          </div>
        </div>

        <div style={{ background: '#f5f5f5', flex: 1 }}>
          <div className="container" style={{ padding: '24px 24px 48px' }}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                { key: 'all', label: `Tất cả (${bookings.length})` },
                { key: 'PENDING', label: `Chờ xác nhận (${bookings.filter(b => b.status === 'PENDING').length})` },
                { key: 'CONFIRMED', label: `Đã xác nhận (${bookings.filter(b => b.status === 'CONFIRMED').length})` },
                { key: 'CANCELLED', label: `Đã hủy (${bookings.filter(b => b.status === 'CANCELLED').length})` },
              ]}
              style={{ marginBottom: 20 }}
            />

            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                  <Skeleton active avatar={{ shape: 'square', size: 120 }} paragraph={{ rows: 3 }} />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 8, padding: '48px 24px' }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>Chưa có đặt phòng nào</div>
                      <div style={{ color: '#929292', marginTop: 4 }}>
                        {activeTab === 'all' ? 'Bạn chưa đặt phòng nào.' : 'Không có đặt phòng nào trong trạng thái này.'}
                      </div>
                    </div>
                  }
                >
                  <Button type="primary" onClick={() => navigate('/')}>
                    Tìm khách sạn ngay
                  </Button>
                </Empty>
              </div>
            ) : (
              filtered.map(booking => <BookingCard key={booking.id} booking={booking} />)
            )}
          </div>
        </div>

        <Footer />
      </div>
    </AuthGuard>
  );
};

export default MyBookingsPage;
