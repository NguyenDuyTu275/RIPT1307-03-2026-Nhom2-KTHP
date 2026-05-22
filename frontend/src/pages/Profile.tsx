import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Avatar, Divider, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, UserOutlined, SaveOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { userApi } from '../api';

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

    // Lấy thông tin thật từ Backend Database
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
          // Fallback
          form.setFieldsValue({ username: localUsername });
        }
      })
      .catch(() => {
        message.warning('Không thể kết nối đến Backend để lấy thông tin chi tiết. Đang hiển thị offline.');
        form.setFieldsValue({ username: localUsername });
      });
  }, [navigate, form, localUsername]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (currentUser && currentUser.id) {
        // Cập nhật lên Backend Database thật
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
        message.success('Cập nhật thông tin lên Database thành công! 🎉');
      } else {
        localStorage.setItem('username', values.username);
        message.success('Cập nhật thành công (Offline)!');
      }
    } catch (err: any) {
      message.error(err?.response?.data || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    message.success('Đã đăng xuất!');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <span className="navbar-title">Booking.com</span>
        </div>
        <Button icon={<ArrowLeftOutlined />} type="text" className="nav-btn"
          onClick={() => navigate('/dashboard')}>Quay lại</Button>
      </nav>

      <div className="section" style={{ maxWidth: 500, margin: '0 auto' }}>
        {/* AVATAR CARD */}
        <Card className="detail-card" style={{ textAlign: 'center', marginBottom: 24, background: '#fff', border: '1px solid #e7e7e7' }}>
          <Avatar size={80} icon={<UserOutlined />}
            style={{ background: '#003b95', fontSize: 36 }} />
          <h2 style={{ color: '#1a1a1a', marginTop: 16, marginBottom: 4 }}>{localUsername}</h2>
          <Tag color={currentUser?.role === 'ADMIN' ? 'red' : 'blue'}>
            {currentUser?.role || 'USER'}
          </Tag>
        </Card>

        {/* EDIT FORM */}
        <Card className="detail-card" style={{ background: '#fff', border: '1px solid #e7e7e7' }}>
          <h3 style={{ color: '#1a1a1a', marginBottom: 20 }}>Thông tin cá nhân</h3>
          <Form form={form} layout="vertical" onFinish={onFinish} size="large">
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

            <Form.Item name="newPassword" label="Mật khẩu mới (Nếu cần đổi)">
              <Input.Password prefix={<LockOutlined style={{ color: '#888' }} />} placeholder="Để trống nếu giữ nguyên" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading} icon={<SaveOutlined />}>
                Lưu thay đổi
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ borderColor: '#e7e7e7' }} />
          <Button danger block size="large" onClick={handleLogout}>Đăng xuất</Button>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
