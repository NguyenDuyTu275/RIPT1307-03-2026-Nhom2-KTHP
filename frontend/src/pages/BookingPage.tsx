import React, { useState } from 'react';
import { Form, DatePicker, Button, Card, message, Divider } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { bookingApi } from '../api';

const { RangePicker } = DatePicker;

const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, hotel } = (location.state as any) || {};
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [form] = Form.useForm();

  const onDateChange = (dates: any) => {
    if (!dates || !dates[0] || !dates[1]) return;
    const days = dates[1].diff(dates[0], 'day');
    setTotalPrice(days * (room?.pricePerNight || 0));
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const [checkIn, checkOut] = values.dates;
      const bookingData = {
        checkInDate: checkIn.format('YYYY-MM-DD'),
        checkOutDate: checkOut.format('YYYY-MM-DD'),
        totalPrice,
        rooms: room ? [{ roomId: room.id, quantity: 1 }] : []
      } as any;
      await bookingApi.create(hotel?.id, bookingData);
      message.success('Đặt phòng thành công! 🎉');
      navigate('/my-bookings');
    } catch (error: any) {
      const msg = typeof error?.response?.data === 'string' 
        ? error.response.data 
        : error?.response?.data?.message || error?.message || 'Đặt phòng thất bại. Vui lòng thử lại.';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="navbar-logo">🏨</span>
          <span className="navbar-title">Hotel Booking</span>
        </div>
        <Button icon={<ArrowLeftOutlined />} type="text" className="nav-btn"
          onClick={() => navigate(-1)}>Quay lại</Button>
      </nav>

      <div className="section" style={{ maxWidth: 600, margin: '0 auto' }}>
        <h2 className="section-title"><CalendarOutlined style={{ marginRight: 8 }} />Đặt Phòng</h2>

        {/* ROOM SUMMARY */}
        {room && (
          <Card className="detail-card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ fontSize: 40 }}>🛏️</div>
              <div>
                <h3 style={{ color: '#f1f5f9', margin: 0 }}>{room.name}</h3>
                <p style={{ color: '#94a3b8', margin: '4px 0' }}>
                  {hotel?.name} · {hotel?.city}
                </p>
                <p style={{ color: '#fbbf24', fontWeight: 700, margin: 0 }}>
                  {room.pricePerNight?.toLocaleString('vi-VN')}₫ / đêm
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* BOOKING FORM */}
        <Card className="detail-card">
          <Form form={form} layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              name="dates"
              label={<span style={{ color: '#cbd5e1' }}>Ngày nhận – trả phòng</span>}
              rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
            >
              <RangePicker
                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}
                disabledDate={(d) => d && d < moment().startOf('day')}
                onChange={onDateChange}
                format="DD/MM/YYYY"
              />
            </Form.Item>

            {totalPrice > 0 && (
              <div className="price-summary">
                <DollarOutlined style={{ color: '#10b981', marginRight: 8 }} />
                <span style={{ color: '#cbd5e1' }}>Tổng tiền ước tính: </span>
                <span style={{ color: '#10b981', fontWeight: 700, fontSize: 18 }}>
                  {totalPrice.toLocaleString('vi-VN')}₫
                </span>
              </div>
            )}

            <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading} size="large">
                Xác nhận đặt phòng
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;
