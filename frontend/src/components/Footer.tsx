import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const popularCities = [
  ['Khách sạn TP. Hồ Chí Minh', 'Khách sạn Vũng Tàu', 'Khách sạn Hà Nội', 'Khách sạn Đà Nẵng', 'Khách sạn Đà Lạt'],
  ['Khách sạn Phú Quốc', 'Khách sạn Nha Trang', 'Khách sạn Huế', 'Khách sạn Mũi Né', 'Khách sạn Sa Pa'],
  ['Khách sạn Thành phố Hải Phòng', 'Khách sạn Mai Châu', 'Khách sạn Hà Tiên', 'Khách sạn Tuần Châu', 'Khách sạn Hội An'],
  ['Khách sạn Tam Đảo', 'Khách sạn Cao Lãnh', 'Khách sạn Vĩnh Phúc', 'Khách sạn Châu Đốc', 'Khách sạn Bảo Cát Bà'],
  ['Khách sạn Cần Thơ', 'Khách sạn Bến Tre', 'Khách sạn Buôn Ma Thuột', 'Khách sạn Mộc Châu', 'Khách sạn Thanh Khê'],
];

const tabs = ['Thành phố trong nước', 'Thành phố nước ngoài', 'Khu vực', 'Quốc gia', 'Chỗ nghỉ'];

const footerCols = [
  {
    title: 'Hỗ trợ',
    links: [
      'Quản lí các chuyến đi của bạn',
      'Liên hệ Dịch vụ Khách hàng',
      'Trung tâm thông tin bảo mật',
    ],
  },
  {
    title: 'Khám phá thêm',
    links: [
      'Chương trình khách hàng thân thiết Genius',
      'Ưu đãi theo mùa và dịp lễ',
      'Bài viết về du lịch',
      'Booking.com dành cho Doanh Nghiệp',
      'Traveller Review Awards',
      'Cho thuê xe hơi',
      'Tìm chuyến bay',
      'Đặt nhà hàng',
    ],
  },
  {
    title: 'Điều khoản và cài đặt',
    links: [
      'Chính sách Bảo mật',
      'Điều khoản dịch vụ',
      'Chính sách về Khả năng tiếp cận',
      'Tranh chấp đối tác',
      'Chính sách chống Nô lệ Hiện đại',
      'Chính sách về Quyền con người',
    ],
  },
  {
    title: 'Dành cho đối tác',
    links: [
      'Đăng nhập vào trang Extranet',
      'Trợ giúp đối tác',
      'Đăng chỗ nghỉ của Quý vị',
      'Trở thành đối tác phân phối',
    ],
  },
  {
    title: 'Về chúng tôi',
    links: [
      'Về Booking.com',
      'Chúng tôi hoạt động như thế nào',
      'Du lịch bền vững',
      'Truyền thông',
      'Cơ hội việc làm',
      'Quan hệ cổ đông',
      'Liên hệ công ty',
      'Hướng dẫn và cáo bạch nội dung',
    ],
  },
];

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showMore, setShowMore] = useState(false);

  return (
    <footer style={{ background: '#fff', borderTop: '1px solid #e7e7e7', marginTop: 'auto' }}>
      {/* Popular destinations section */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 20 }}>
          Phổ biến với du khách từ Việt Nam
        </h2>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid #e7e7e7', overflowX: 'auto' }}>
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 500,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                borderBottom: activeTab === i ? '2px solid #006ce4' : '2px solid transparent',
                color: activeTab === i ? '#006ce4' : '#595959',
                borderRadius: '4px 4px 0 0',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid of links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px 16px' }}>
          {popularCities.map((col, ci) =>
            col.map((city, ri) => (
              <a
                key={`${ci}-${ri}`}
                href="#"
                style={{
                  fontSize: 13,
                  color: '#006ce4',
                  padding: '3px 0',
                  display: 'block',
                  textDecoration: 'none',
                  transition: 'text-decoration 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
              >
                {city}
              </a>
            ))
          )}
        </div>

        {/* Show more */}
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => setShowMore(!showMore)}
            style={{
              background: 'none',
              border: 'none',
              color: '#006ce4',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: 0,
            }}
          >
            <span style={{ fontSize: 16 }}>+</span>
            {showMore ? 'Ẩn bớt' : 'Hiện thị thêm'}
          </button>
        </div>

        {/* Quick nav tags */}
        <div style={{ marginTop: 24, padding: '16px 0', borderTop: '1px solid #e7e7e7', fontSize: 12, color: '#595959', lineHeight: 2, flexWrap: 'wrap' }}>
          {[
            'Các quốc gia', 'Khu vực', 'Thành phố', 'Quận', 'Sân bay', 'Khách sạn', 'Địa điểm được quan tâm',
            'Các Nhà Nghỉ Giường', 'Căn hộ', 'Các resort', 'Các biệt thự', 'Các hostel', 'Nhà nghỉ B&B',
            'Các nhà khách', 'Những chỗ nghỉ độc đáo', 'Tất cả các điểm đến', 'Tất cả các điểm đến có chuyến bay',
            'Tất cả địa điểm cho thuê xe', 'Tất cả địa điểm dành cho chỗ nghỉ', 'Hướng dẫn', 'Khám phá',
            'Khám phá lưu trú theo tháng',
          ].map((tag, i, arr) => (
            <span key={tag}>
              <a href="#" style={{ color: '#595959', textDecoration: 'none', fontSize: 12 }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
              >{tag}</a>
              {i < arr.length - 1 && <span style={{ margin: '0 6px', color: '#c2c2c2' }}>·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Modern Light Footer Columns */}
      <div style={{ background: '#fff', paddingTop: 40, paddingBottom: 0 }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px 40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '24px 32px',
          }}
        >
          {footerCols.map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
                {col.title}
              </div>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{ display: 'block', color: '#006ce4', fontSize: 13, marginBottom: 12, textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '24px 24px',
            borderTop: '1px solid #e7e7e7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ fontSize: 13, color: '#595959', fontWeight: 500 }}>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
