import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Divider, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, SaveOutlined, MailOutlined, LockOutlined, HeartOutlined, CalendarOutlined, HomeOutlined } from '@ant-design/icons';
import { userApi } from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [form] = Form.useForm();
  const localUsername = localStorage.getItem('username') || 'User';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    userApi.getAll()
      .then(res => {
        const users = res.data || [];
        const found = users.find((u: any) => u.username === localUsername);
        if (found) {
          setCurrentUser(found);
          form.setFieldsValue({
            username: found.username,
            email: found.email,
          });
        } else {
          form.setFieldsValue({ username: localUsername });
        }
      })
      .catch(() => {
        message.warning('Đang hiển thị offline.');
        form.setFieldsValue({ username: localUsername });
      });
  }, [navigate, form, localUsername]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (currentUser && currentUser.id) {
        const updatedData = {
          ...currentUser,
          username: values.username,
          email: values.email,
        };
        if (values.newPassword) {
          updatedData.password = values.newPassword;
        }
        await userApi.update(currentUser.id, updatedData);
        localStorage.setItem('username', values.username);
        message.success('Cập nhật thông tin thành công! 🎉');
      } else {
        localStorage.setItem('username', values.username);
        message.success('Cập nhật thành công (Offline)!');
      }
    } catch (err: any) {
      message.error(err?.response?.data || 'Cập nhật thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success('Đã đăng xuất!');
    navigate('/login');
  };

  return (
    <div className="page-wrapper" style={{ background: '#f5f5f5' }}>
      <Header />

      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-avatar" style={{ overflow: 'hidden', padding: 0 }}>
              {localStorage.getItem('avatarUrl') ? (
                <img src={localStorage.getItem('avatarUrl') as string} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                localUsername.charAt(0).toUpperCase()
              )}
            </div>
            <div className="profile-username">{localUsername}</div>
            <div className="profile-email">{currentUser?.email || 'Chưa cập nhật email'}</div>

            {currentUser?.role === 'ADMIN' && (
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <Tag color="red">Quản trị viên</Tag>
              </div>
            )}

            <div className="profile-menu">
              <div className="profile-menu-item active">
                <UserOutlined /> Thông tin cá nhân
              </div>
              <div className="profile-menu-item" onClick={() => navigate('/my-bookings')}>
                <CalendarOutlined /> Lịch sử đặt phòng
              </div>
              <div className="profile-menu-item" onClick={() => navigate('/wishlist')}>
                <HeartOutlined /> Khách sạn đã lưu
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="profile-content">
            <div className="profile-content-card">
              <div className="profile-content-title">Quản lý tài khoản</div>
              
              <Form form={form} layout="vertical" onFinish={onFinish} size="large" style={{ maxWidth: 500 }}>
                <Form.Item
                  name="username"
                  label="Tên đăng nhập"
                  rules={[{ required: true, message: 'Tên đăng nhập không được trống!' }]}
                >
                  <Input prefix={<UserOutlined style={{ color: '#888' }} />} />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Email không được trống!' },
                    { type: 'email', message: 'Email không đúng định dạng!' }
                  ]}
                >
                  <Input prefix={<MailOutlined style={{ color: '#888' }} />} />
                </Form.Item>

                <Form.Item name="newPassword" label="Mật khẩu mới">
                  <Input.Password prefix={<LockOutlined style={{ color: '#888' }} />} placeholder="Để trống nếu không đổi mật khẩu" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                    Lưu thay đổi
                  </Button>
                </Form.Item>
              </Form>

              <Divider />
              <div style={{ display: 'flex', gap: 12 }}>
                <Button danger onClick={handleLogout}>Đăng xuất</Button>
                <Button onClick={() => navigate('/')} icon={<HomeOutlined />}>Quay về trang chủ</Button>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
