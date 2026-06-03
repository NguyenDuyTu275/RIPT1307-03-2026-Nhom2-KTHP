import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, DatePicker, Button, Divider, message, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, ProfileOutlined, BankOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import Header from '../components/Header';
import { getHotelImage } from '../components/HotelCard';
import { hotelApi, bookingApi } from '../api';

const GuestInfoPage: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as any) || {};
  const [form] = Form.useForm();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [checkIn, setCheckIn] = useState<Moment | null>(
    locationState.checkIn ? moment(locationState.checkIn, 'YYYY-MM-DD') : moment().add(1, 'day')
  );
  const [checkOut, setCheckOut] = useState<Moment | null>(
    locationState.checkOut ? moment(locationState.checkOut, 'YYYY-MM-DD') : moment().add(3, 'day')
  );

  // roomId được truyền từ HotelDetailPage (nếu có), fallback về rooms[0]
  const selectedRoomId: number | null = locationState.roomId ?? null;

  const token = localStorage.getItem('token');
  const nights = checkIn && checkOut ? checkOut.diff(checkIn, 'day') : 2;

  // Tính giá dựa trên phòng được chọn
  const selectedRoom = hotel?.rooms?.find((r: any) => r.id === selectedRoomId) ?? hotel?.rooms?.[0] ?? null;
  const pricePerNight = selectedRoom?.pricePerNight ?? 0;
  const totalPrice = pricePerNight * Math.max(1, nights);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    if (hotelId) {
      hotelApi.getById(Number(hotelId))
        .then(res => setHotel(res.data))
        .catch(() => {});
    }
  }, [hotelId, token, navigate]);

  const handleSubmit = async (values: any) => {
    if (!checkIn || !checkOut) {
      message.error('Vui lòng chọn ngày nhận và trả phòng!');
      return;
    }
    setSubmitting(true);
    try {
      const roomToBook = selectedRoom;
      if (!roomToBook) {
        message.error('Không tìm thấy thông tin phòng. Vui lòng quay lại trang khách sạn và thử lại!');
        setSubmitting(false);
        return;
      }
      const bookingData = {
        checkInDate: checkIn?.format('YYYY-MM-DD'),
        checkOutDate: checkOut?.format('YYYY-MM-DD'),
        rooms: [{ roomId: roomToBook.id, quantity: 1 }]
      } as any;
      const booking = await bookingApi.create(Number(hotelId), bookingData);
      navigate('/booking/confirmation', {
        state: {
          booking: booking.data,
          hotel,
          guestInfo: values,
          room: roomToBook,
          checkIn: checkIn.format('DD/MM/YYYY'),
          checkOut: checkOut.format('DD/MM/YYYY'),
          nights,
          totalPrice,
        },
      });
    } catch (err: any) {
      const errorMsg = typeof err?.response?.data === 'string' 
        ? err.response.data 
        : err?.response?.data?.message || err?.message || 'Đặt phòng thất bại. Vui lòng thử lại!';
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <Header showSearch />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 48px' }}>
        {/* Back button */}
        <button
          onClick={() => navigate(`/hotels/${hotelId}`)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#006ce4', fontSize: 14, fontWeight: 600,
            padding: '4px 0', marginBottom: 16,
          }}
        >
          ← Quay lại trang khách sạn
        </button>

        {/* Steps indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['1. Thông tin khách', '2. Thanh toán', '3. Xác nhận'].map((step, i) => (
            <div key={step} style={{
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              background: i === 0 ? '#003b95' : '#fff',
              color: i === 0 ? '#fff' : '#929292',
              border: '1px solid #e7e7e7',
            }}>
              {step}
            </div>
          ))}
        </div>

        <div className="booking-layout">
          {/* Left: Form */}
          <div>
            <div className="booking-form-card">
              <div className="booking-form-title"><UserOutlined style={{ marginRight: 8, color: '#006ce4' }} />Thông tin khách lưu trú</div>
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="firstName" label="Tên" rules={[{ required: true, message: 'Nhập tên!' }]}>
                      <Input prefix={<UserOutlined />} placeholder="Nguyễn" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="lastName" label="Họ" rules={[{ required: true, message: 'Nhập họ!' }]}>
                      <Input placeholder="Văn An" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Nhập email hợp lệ!' }]}>
                  <Input prefix={<MailOutlined />} placeholder="example@gmail.com" />
                </Form.Item>

                <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT!' }]}>
                  <Input prefix={<PhoneOutlined />} placeholder="0912 345 678" />
                </Form.Item>

                <Form.Item name="requests" label="Yêu cầu đặc biệt (tùy chọn)">
                  <Input.TextArea rows={3} placeholder="Ví dụ: phòng tầng cao, giường thêm cho trẻ em..." />
                </Form.Item>
              </Form>
            </div>

            <div className="booking-form-card">
              <div className="booking-form-title"><CalendarOutlined style={{ marginRight: 8, color: '#006ce4' }} />Ngày lưu trú</div>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: 8 }}>Ngày nhận phòng <span style={{ color: '#ff4d4f' }}>*</span></div>
                  <DatePicker
                    value={checkIn}
                    onChange={(val) => {
                      setCheckIn(val);
                      if (val && checkOut && val.isSameOrAfter(checkOut)) {
                        setCheckOut(val.clone().add(1, 'day'));
                      }
                    }}
                    format="DD/MM/YYYY"
                    disabledDate={(d) => d.isBefore(moment(), 'day')}
                    style={{ width: '100%', height: 40 }}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: 8 }}>Ngày trả phòng <span style={{ color: '#ff4d4f' }}>*</span></div>
                  <DatePicker
                    value={checkOut}
                    onChange={setCheckOut}
                    format="DD/MM/YYYY"
                    disabledDate={(d) => d.isBefore(checkIn || moment(), 'day')}
                    style={{ width: '100%', height: 40 }}
                  />
                </Col>
              </Row>
            </div>

            <Button
              type="primary"
              size="large"
              block
              loading={submitting}
              onClick={() => form.submit()}
              style={{ height: 52, fontSize: 16, fontWeight: 700, background: '#006ce4', borderColor: '#006ce4', borderRadius: 4 }}
            >
              Xác nhận đặt phòng
            </Button>
          </div>

          {/* Right: Summary */}
          <div className="booking-summary">
            <div className="booking-summary-title"><ProfileOutlined style={{ marginRight: 8, color: '#006ce4' }} />Chi tiết đặt phòng</div>

            <div className="booking-summary-hotel">
              <div className="booking-summary-hotel-img">
                {(() => {
                  const imgUrl = getHotelImage(hotel);
                  return imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={hotel?.name}
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                          (target.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null;
                })()}
                <div style={{ display: getHotelImage(hotel) ? 'none' : 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: 32, background: 'linear-gradient(135deg, #e8f0fe, #f0f0f0)', borderRadius: 4 }}>
                  <BankOutlined style={{ color: '#006ce4' }} />
                </div>
              </div>
              <div>
                <div className="booking-summary-hotel-name">{hotel?.name || 'Đang tải...'}</div>
                <div style={{ fontSize: 12, color: '#595959' }}>📍 {hotel?.city || hotel?.address || 'Việt Nam'}</div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ background: '#003b95', color: '#fff', fontSize: 11, padding: '2px 6px', borderRadius: 3 }}>
                    {(hotel?.ratingAvg ?? 8.5).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="booking-summary-row">
              <span className="booking-summary-label">Nhận phòng</span>
              <span className="booking-summary-value">{checkIn?.format('DD/MM/YYYY') || '—'}</span>
            </div>
            <div className="booking-summary-row">
              <span className="booking-summary-label">Trả phòng</span>
              <span className="booking-summary-value">{checkOut?.format('DD/MM/YYYY') || '—'}</span>
            </div>
            <div className="booking-summary-row">
              <span className="booking-summary-label">Số đêm</span>
              <span className="booking-summary-value">{Math.max(1, nights)} đêm</span>
            </div>
            <div className="booking-summary-row">
              <span className="booking-summary-label">Giá mỗi đêm</span>
              <span className="booking-summary-value">{pricePerNight.toLocaleString('vi-VN')}₫</span>
            </div>

            <div className="booking-summary-total">
              <div className="booking-summary-row" style={{ margin: 0 }}>
                <span className="booking-summary-label">Tổng cộng</span>
                <span className="booking-summary-value">{totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>

            <div style={{ background: '#e6f5ea', borderRadius: 6, padding: 12, marginTop: 16, fontSize: 13, color: '#008234' }}>
              ✓ Miễn phí hủy phòng trước 24 giờ<br />
              ✓ Không mất phí đặt phòng<br />
              ✓ Thanh toán tại khách sạn
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestInfoPage;
