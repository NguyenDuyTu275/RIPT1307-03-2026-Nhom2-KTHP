import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Spin, message, Divider } from 'antd';
import { CheckCircleOutlined, CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { paymentApi } from '../api';

const PaymentPage: React.FC = () => {
  const { state } = useLocation() as { state: any };
  const navigate = useNavigate();
  const [qrData, setQrData] = useState<any>(null);
  const [loadingQr, setLoadingQr] = useState(true);
  const [confirming, setConfirming] = useState(false);

  const booking = state?.booking;
  const hotel = state?.hotel;
  const guestInfo = state?.guestInfo;
  const checkIn = state?.checkIn;
  const checkOut = state?.checkOut;
  const nights = state?.nights;
  const totalPrice = state?.totalPrice;

  useEffect(() => {
    if (!booking?.id) {
      navigate('/');
      return;
    }
    
    paymentApi.getPaymentQr(booking.id)
      .then((data: any) => setQrData(data))
      .catch((e: any) => {
        message.error('Không thể tải mã QR: ' + (e?.message || 'Lỗi không xác định'));
      })
      .finally(() => setLoadingQr(false));
  }, [booking?.id, navigate]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => message.success(`Đã sao chép ${label}!`));
  };

  const handleConfirmPayment = async () => {
    setConfirming(true);
    try {
      await paymentApi.confirmPayment(booking.id);
      message.success('Đã gửi xác nhận thanh toán tới Admin!');
      navigate('/booking/confirmation', { state });
    } catch (e: any) {
      message.error(e?.message || 'Xác nhận thất bại, vui lòng thử lại!');
    } finally {
      setConfirming(false);
    }
  };

  if (!booking) return null;

  return (
    <div className="page-wrapper" style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <Header showSearch />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 48px' }}>
        {/* Steps indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['1. Thông tin khách', '2. Thanh toán', '3. Xác nhận'].map((step, i) => (
            <div key={step} style={{
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              background: i === 1 ? '#003b95' : '#fff',
              color: i === 1 ? '#fff' : '#929292',
              border: '1px solid #e7e7e7',
            }}>
              {step}
            </div>
          ))}
        </div>

        {/* Header card */}
        <div style={{
          background: '#fff',
          border: '1px solid #e7e7e7',
          borderRadius: 12,
          padding: '24px 28px',
          marginBottom: 20,
          borderTop: '4px solid #006ce4',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>💳 Thanh toán đặt phòng</h2>
          <p style={{ color: '#595959', fontSize: 14, margin: 0 }}>
            Quét mã QR hoặc chuyển khoản theo thông tin bên dưới để hoàn tất đặt phòng tại <strong>{hotel?.name}</strong>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* QR Code */}
          <div style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: '#1a1a1a' }}>📱 Mã QR thanh toán</div>
            {loadingQr ? (
              <div style={{ padding: '40px 0' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
                <div style={{ marginTop: 12, color: '#595959', fontSize: 13 }}>Đang tải mã QR...</div>
              </div>
            ) : qrData?.qrCodeUrl ? (
              <>
                <img
                  src={qrData.qrCodeUrl}
                  alt="QR Code thanh toán"
                  style={{ width: '100%', maxWidth: 220, borderRadius: 8, border: '1px solid #e0e0e0' }}
                />
                <div style={{ marginTop: 12, fontSize: 12, color: '#008234', fontWeight: 600 }}>
                  ✅ Hỗ trợ tất cả app ngân hàng
                </div>
              </>
            ) : (
              <div style={{ padding: '20px 0', color: '#ff4d4f' }}>Không thể tải mã QR</div>
            )}
          </div>

          {/* Transfer info */}
          <div style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 12, padding: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: '#1a1a1a' }}>🏦 Thông tin chuyển khoản</div>

            {loadingQr ? (
              <Spin size="small" />
            ) : qrData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Ngân hàng', value: qrData.bankName },
                  { label: 'Số tài khoản', value: qrData.accountNumber, copyable: true },
                  { label: 'Chủ tài khoản', value: qrData.accountName },
                  { label: 'Nội dung', value: qrData.transferContent, copyable: true },
                ].map(({ label, value, copyable }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 2 }}>{label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', wordBreak: 'break-all' }}>{value}</span>
                      {copyable && (
                        <Button
                          size="small"
                          type="text"
                          icon={<CopyOutlined />}
                          onClick={() => handleCopy(value, label)}
                          style={{ color: '#006ce4', flexShrink: 0 }}
                        />
                      )}
                    </div>
                  </div>
                ))}

                <Divider style={{ margin: '4px 0' }} />
                <div>
                  <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 2 }}>Số tiền cần chuyển</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#006ce4' }}>
                    {(qrData.amount || totalPrice || 0).toLocaleString('vi-VN')}₫
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Booking summary */}
        <div style={{ background: '#fff', border: '1px solid #e7e7e7', borderRadius: 12, padding: 20, marginTop: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>📋 Tóm tắt đặt phòng</div>
          {[
            ['Mã đặt phòng', `BK${String(booking.id).padStart(6, '0')}`],
            ['Khách sạn', hotel?.name],
            ['Nhận phòng', checkIn],
            ['Trả phòng', checkOut],
            ['Số đêm', `${Math.max(1, nights || 1)} đêm`],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f5f5f5', fontSize: 13 }}>
              <span style={{ color: '#595959' }}>{label}</span>
              <span style={{ fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div style={{ background: '#fff7e6', border: '1px solid #ffd591', borderRadius: 8, padding: 14, marginTop: 16, fontSize: 13, color: '#d46b08' }}>
          ⚠️ <strong>Lưu ý:</strong> Sau khi chuyển khoản, nhấn <strong>"Xác nhận đã thanh toán"</strong> để thông báo cho Admin kiểm tra. Đặt phòng sẽ được xác nhận sau khi Admin duyệt.
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <Button
            size="large"
            style={{ flex: 1, height: 52 }}
            onClick={() => navigate('/my-bookings')}
          >
            Thanh toán sau
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<CheckCircleOutlined />}
            loading={confirming}
            style={{ flex: 2, height: 52, fontSize: 15, fontWeight: 700, background: '#006ce4' }}
            onClick={handleConfirmPayment}
          >
            Xác nhận đã thanh toán
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;
