import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Spin, Empty, message, Modal, Form, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, UserOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { userApi } from '../api';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Load all users from backend
  const loadUsers = () => {
    setLoading(true);
    userApi.getAll()
      .then(res => {
        setUsers(res.data || []);
      })
      .catch((err) => {
        message.error('Không thể lấy danh sách người dùng từ Server!');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (!token || username !== 'admin') {
      message.error('Bạn không có quyền truy cập trang quản trị!');
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, [navigate]);

  // Handle delete user
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa người dùng này khỏi hệ thống không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await userApi.delete(id);
          message.success('Đã xóa người dùng thành công!');
          loadUsers();
        } catch (error) {
          message.error('Không thể xóa người dùng.');
        }
      }
    });
  };

  // Open edit modal
  const openEditModal = (user: any) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  // Open create modal
  const openCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Handle submit modal (create/update)
  const handleModalSubmit = async (values: any) => {
    try {
      if (editingUser) {
        // Update user
        const updated = { ...editingUser, ...values };
        await userApi.update(editingUser.id, updated);
        message.success('Cập nhật người dùng thành công!');
      } else {
        // Create user
        await userApi.create(values);
        message.success('Thêm người dùng mới thành công!');
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (error) {
      message.error('Thao tác thất bại. Vui lòng thử lại.');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Tên đăng nhập', dataIndex: 'username', key: 'username', render: (v: string) => <b style={{ color: '#1a1a1a' }}>{v}</b> },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (v: string) => (
        <Tag color={v === 'ADMIN' ? 'red' : 'blue'}>
          {v || 'USER'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      render: (_: any, record: any) => (
        record.username === 'admin' ? null : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>Sửa</Button>
            <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Xóa</Button>
          </div>
        )
      )
    },
  ];

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <span className="navbar-title">Admin Console</span>
        </div>
        <Button icon={<ArrowLeftOutlined />} type="text" className="nav-btn"
          onClick={() => navigate('/dashboard')}>Về Dashboard</Button>
      </nav>

      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 className="section-title">
              <UserOutlined style={{ marginRight: 8 }} />Quản lý người dùng
            </h2>
            <p className="section-subtitle" style={{ margin: 0 }}>Xem, thêm, sửa và xóa các tài khoản trong Database</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal} style={{ height: 40 }}>
            Thêm tài khoản mới
          </Button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
        ) : users.length === 0 ? (
          <Empty description="Không có tài khoản nào" />
        ) : (
          <Card className="detail-card" style={{ overflowX: 'auto', background: '#fff', border: '1px solid #e7e7e7' }}>
            <Table
              dataSource={users}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal
        title={editingUser ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleModalSubmit} size="large" style={{ marginTop: 16 }}>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input disabled={!!editingUser} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không đúng định dạng!' }
            ]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Vai trò (Role)"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            initialValue="USER"
          >
            <Select>
              <Select.Option value="USER">USER</Select.Option>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
