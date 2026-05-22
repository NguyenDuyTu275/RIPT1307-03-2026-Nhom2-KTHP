import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="footer-col-title">Hỗ trợ</div>
          <a onClick={() => navigate('/help')}>Trung tâm trợ giúp</a>
          <a onClick={() => navigate('/contact')}>Liên hệ chúng tôi</a>
          <a href="#">Báo cáo vấn đề</a>
          <a href="#">Ứng dụng di động</a>
          <a href="#">Xác nhận đặt phòng</a>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Khám phá</div>
          <a onClick={() => navigate('/destinations')}>Điểm đến nổi bật</a>
          <a onClick={() => navigate('/deals')}>Ưu đãi & Khuyến mãi</a>
          <a href="#">Nghỉ dưỡng cuối tuần</a>
          <a href="#">Khách sạn theo mùa</a>
          <a href="#">Du lịch trong nước</a>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Tài khoản</div>
          <a onClick={() => navigate('/login')}>Đăng nhập</a>
          <a onClick={() => navigate('/register')}>Tạo tài khoản</a>
          <a onClick={() => navigate('/my-bookings')}>Đặt chỗ của tôi</a>
          <a onClick={() => navigate('/profile')}>Hồ sơ cá nhân</a>
          <a onClick={() => navigate('/wishlist')}>Danh sách yêu thích</a>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Về chúng tôi</div>
          <a href="#">Về Booking.com</a>
          <a href="#">Tuyển dụng</a>
          <a onClick={() => navigate('/privacy')}>Chính sách bảo mật</a>
          <a onClick={() => navigate('/privacy')}>Điều khoản sử dụng</a>
          <a href="#">Chương trình đối tác</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-logo">Booking.com™</div>
        <div className="footer-bottom-copy">
          Bản quyền © 2006–2026 Booking.com™. Bảo lưu mọi quyền.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
