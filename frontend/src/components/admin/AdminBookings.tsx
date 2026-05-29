import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Spin, Empty, message, Modal, Input, Card, Select } from 'antd';
import { CheckOutlined, CloseOutlined, DollarOutlined } from '@ant-design/icons';
import { adminApi } from '../../api';

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  
  // Modal từ chối
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);

  const loadBookings = () => {
    setLoading(true);
    adminApi.getBookings(filterStatus)
      .then(res => {
        setBookings(res.data || []);
      })
      .catch((err) => {
        message.error('Không thể tải danh sách booking');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, [filterStatus]);

  const handleApprove = async (id: number) => {
    try {
      await adminApi.approveBooking(id);
      message.success('Đã duyệt booking thành công');
      loadBookings();
    } catch (error) {
      message.error('Lỗi khi duyệt booking');
    }
  };

  const handleMarkPaid = async (id: number) => {
    try {
      await adminApi.markBookingPaid(id);
      message.success('Đã đánh dấu thanh toán thành công');
      loadBookings();
    } catch (error) {
      message.error('Lỗi khi cập nhật thanh toán');
    }
  };

  const openRejectModal = (id: number) => {
    setCurrentBookingId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const submitReject = async () => {
    if (!currentBookingId) return;
    if (!rejectReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối');
      return;
    }
    try {
      await adminApi.rejectBooking(currentBookingId, rejectReason);
      message.success('Đã từ chối booking');
      setRejectModalOpen(false);
      loadBookings();
    } catch (error) {
      message.error('Lỗi khi từ chối booking');
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'PENDING': return <Tag color="gold">Chờ duyệt</Tag>;
      case 'CONFIRMED': return <Tag color="green">Đã duyệt</Tag>;
      case 'REJECTED': return <Tag color="red">Từ chối</Tag>;
      case 'CANCELLED': return <Tag color="default">Đã hủy</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const getPaymentStatusTag = (status: string) => {
    switch (status) {
      case 'UNPAID': return <Tag color="red">Chưa thanh toán</Tag>;
      case 'PAID': return <Tag color="green">Đã thanh toán</Tag>;
      case 'REFUNDED': return <Tag color="default">Đã hoàn tiền</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { 
      title: 'Khách hàng', 
      key: 'user', 
      render: (_: any, record: any) => <b>{record.user?.username || 'N/A'}</b>
    },
    { 
      title: 'Khách sạn', 
      key: 'hotel',
      render: (_: any, record: any) => <span>{record.hotel?.name || 'N/A'}</span>
    },
    { 
      title: 'Thời gian', 
      key: 'dates',
      render: (_: any, record: any) => (
        <div style={{ fontSize: 13 }}>
          <div><b>In:</b> {record.checkInDate}</div>
          <div><b>Out:</b> {record.checkOutDate}</div>
        </div>
      )
    },
    { 
      title: 'Tổng tiền', 
      dataIndex: 'totalPrice', 
      key: 'totalPrice',
      render: (v: number) => <b style={{ color: '#006ce4' }}>{v?.toLocaleString('vi-VN')}₫</b>
    },
    { 
      title: 'Trạng thái', 
      key: 'status',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {getStatusTag(record.status)}
          {getPaymentStatusTag(record.paymentStatus)}
        </div>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {record.status === 'PENDING' && (
            <>
              <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(record.id)}>Duyệt</Button>
              <Button size="small" danger icon={<CloseOutlined />} onClick={() => openRejectModal(record.id)}>Từ chối</Button>
            </>
          )}
          {record.paymentStatus === 'UNPAID' && record.status !== 'CANCELLED' && record.status !== 'REJECTED' && (
            <Button size="small" icon={<DollarOutlined />} style={{ color: '#52c41a', borderColor: '#52c41a' }} onClick={() => handleMarkPaid(record.id)}>
              Đã thu tiền
            </Button>
          )}
        </div>
      )
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>Quản lý Đặt phòng</h2>
        <Select
          style={{ width: 150 }}
          placeholder="Lọc theo trạng thái"
          allowClear
          value={filterStatus}
          onChange={setFilterStatus}
        >
          <Select.Option value="PENDING">Chờ duyệt</Select.Option>
          <Select.Option value="CONFIRMED">Đã duyệt</Select.Option>
          <Select.Option value="REJECTED">Từ chối</Select.Option>
          <Select.Option value="CANCELLED">Đã hủy</Select.Option>
        </Select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
      ) : bookings.length === 0 ? (
        <Empty description="Không có booking nào" />
      ) : (
        <Card style={{ padding: 0 }} bodyStyle={{ padding: 0 }}>
          <Table
            dataSource={bookings}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 900 }}
          />
        </Card>
      )}

      {/* Modal từ chối booking */}
      <Modal
        title="Từ chối Đặt phòng"
        open={rejectModalOpen}
        onOk={submitReject}
        onCancel={() => setRejectModalOpen(false)}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true }}
      >
        <p>Vui lòng nhập lý do từ chối để thông báo cho khách hàng:</p>
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          placeholder="Khách sạn đã hết phòng trống..."
        />
      </Modal>
    </div>
  );
};

export default AdminBookings;
