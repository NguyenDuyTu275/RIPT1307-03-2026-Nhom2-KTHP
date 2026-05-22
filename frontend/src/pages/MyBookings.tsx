import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Spin, Empty, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import { bookingApi } from '../api';

const statusColor: Record<string, string> = {
  CONFIRMED: 'green', PENDING: 'orange', CANCELLED: 'red', COMPLETED: 'blue',
};
const paymentColor: Record<string, string> = {
  PAID: 'green', UNPAID: 'orange', REFUNDED: 'blue',
};

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    bookingApi.getMyBookings()
      .then(res => setBookings(res.data || []))
      .catch((err) => {
        message.error('Không thể tải lịch sử đặt phòng từ Database!');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleCancel = async (id: number) => {
    try {
      await bookingApi.cancel(id);
      setBookings(prev => prev.filter(b => b.id !== id));
      message.success('Đã hủy đặt phòng!');
    } catch {
      message.error('Không thể hủy. Vui lòng thử lại.');
    }
  };

  const columns = [
    { title: 'Khách sạn', dataIndex: ['hotel', 'name'], key: 'hotel', render: (v: string) => <b style={{ color: '#e2e8f0' }}>{v || '—'}</b> },
    { title: 'Nhận phòng', dataIndex: 'checkInDate', key: 'checkIn' },
    { title: 'Trả phòng', dataIndex: 'checkOutDate', key: 'checkOut' },
    {
      title: 'Tổng tiền', dataIndex: 'totalPrice', key: 'total',
      render: (v: number) => <span style={{ color: '#10b981', fontWeight: 700 }}>{v?.toLocaleString('vi-VN')}₫</span>
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (v: string) => <Tag color={statusColor[v] || 'default'}>{v}</Tag>
    },
    {
      title: 'Thanh toán', dataIndex: 'paymentStatus', key: 'payment',
      render: (v: string) => <Tag color={paymentColor[v] || 'default'}>{v}</Tag>
    },
    {
      title: 'Hành động', key: 'action',
      render: (_: any, record: any) => (
        record.status === 'CANCELLED' || record.status === 'COMPLETED' ? null :
          <Button danger size="small" onClick={() => handleCancel(record.id)}>Hủy</Button>
      )
    },
  ];

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="navbar-logo">🏨</span>
          <span className="navbar-title">Hotel Booking</span>
        </div>
        <Button icon={<ArrowLeftOutlined />} type="text" className="nav-btn"
          onClick={() => navigate('/dashboard')}>Quay lại</Button>
      </nav>

      <div className="section">
        <h2 className="section-title">
          <CalendarOutlined style={{ marginRight: 8 }} />Lịch sử đặt phòng
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
        ) : bookings.length === 0 ? (
          <Empty description={<span style={{ color: '#64748b' }}>Bạn chưa có đặt phòng nào</span>}>
            <Button type="primary" onClick={() => navigate('/dashboard')}>Khám phá khách sạn</Button>
          </Empty>
        ) : (
          <Card className="detail-card" style={{ overflowX: 'auto' }}>
            <Table
              dataSource={bookings}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 8 }}
              className="bookings-table"
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
