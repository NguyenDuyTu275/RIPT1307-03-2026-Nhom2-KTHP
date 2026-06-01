import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Upload, Spin, Switch, Drawer, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, PictureOutlined } from '@ant-design/icons';
import { hotelApi, imageApi, roomApi } from '../../api';
import type { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;

const AdminHotels: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Khách sạn
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<any>(null);
  const [hotelForm] = Form.useForm();

  // Upload Ảnh Khách sạn
  const [uploadHotelModalOpen, setUploadHotelModalOpen] = useState(false);
  const [currentUploadHotelId, setCurrentUploadHotelId] = useState<number | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // Drawer Phòng
  const [roomsDrawerOpen, setRoomsDrawerOpen] = useState(false);
  const [currentHotelForRooms, setCurrentHotelForRooms] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Modal Thêm Phòng
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [roomForm] = Form.useForm();

  // Upload Ảnh Phòng
  const [uploadRoomModalOpen, setUploadRoomModalOpen] = useState(false);
  const [currentUploadRoomId, setCurrentUploadRoomId] = useState<number | null>(null);
  const [roomFileList, setRoomFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const res = await hotelApi.getAll();
      setHotels(res.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách khách sạn');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHotel = async (values: any) => {
    try {
      if (editingHotel) {
        await hotelApi.update(editingHotel.id, values);
        message.success('Cập nhật khách sạn thành công');
      } else {
        await hotelApi.create(values);
        message.success('Thêm khách sạn thành công');
      }
      setHotelModalOpen(false);
      loadHotels();
    } catch (error) {
      message.error('Lưu khách sạn thất bại');
    }
  };

  const handleDeleteHotel = (id: number) => {
    Modal.confirm({
      title: 'Xóa khách sạn',
      content: 'Bạn có chắc chắn muốn xóa khách sạn này không? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await hotelApi.delete(id);
          message.success('Đã xóa khách sạn');
          loadHotels();
        } catch (error) {
          message.error('Lỗi khi xóa khách sạn');
        }
      }
    });
  };

  const handleUploadHotelImage = async () => {
    if (!currentUploadHotelId || fileList.length === 0) {
      message.warning('Vui lòng chọn ảnh');
      return;
    }
    const file = fileList[0].originFileObj as File;
    try {
      setUploading(true);
      await imageApi.uploadHotelImage(currentUploadHotelId, file);
      message.success('Tải ảnh lên thành công');
      setUploadHotelModalOpen(false);
      setFileList([]);
      loadHotels();
    } catch (error) {
      message.error('Lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  const openRoomsDrawer = async (hotel: any) => {
    setCurrentHotelForRooms(hotel);
    setRoomsDrawerOpen(true);
    loadRooms(hotel.id);
  };

  const loadRooms = async (hotelId: number) => {
    try {
      setLoadingRooms(true);
      const res = await roomApi.getByHotel(hotelId);
      setRooms(res.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách phòng');
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleSaveRoom = async (values: any) => {
    try {
      await roomApi.create(currentHotelForRooms.id, values);
      message.success('Thêm phòng thành công');
      setRoomModalOpen(false);
      loadRooms(currentHotelForRooms.id);
    } catch (error) {
      message.error('Lỗi khi thêm phòng');
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    Modal.confirm({
      title: 'Xóa phòng',
      content: 'Bạn có chắc muốn xóa phòng này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await roomApi.delete(roomId);
          message.success('Đã xóa phòng');
          loadRooms(currentHotelForRooms.id);
        } catch (error) {
          message.error('Lỗi khi xóa phòng');
        }
      }
    });
  };

  const handleUploadRoomImage = async () => {
    if (!currentUploadRoomId || roomFileList.length === 0) {
      message.warning('Vui lòng chọn ảnh');
      return;
    }
    const file = roomFileList[0].originFileObj as File;
    try {
      setUploading(true);
      await imageApi.uploadRoomImage(currentUploadRoomId, file);
      message.success('Tải ảnh lên thành công');
      setUploadRoomModalOpen(false);
      setRoomFileList([]);
      loadRooms(currentHotelForRooms.id);
    } catch (error) {
      message.error('Lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  const hotelColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { 
      title: 'Ảnh đại diện', 
      key: 'image',
      render: (_: any, record: any) => (
        record.images && record.images.length > 0 ? (
          <img src={record.images[0].url} alt="hotel" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          <div style={{ width: 60, height: 40, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PictureOutlined style={{ color: '#ccc' }} />
          </div>
        )
      )
    },
    { title: 'Tên khách sạn', dataIndex: 'name', key: 'name', render: (text: string) => <b>{text}</b> },
    { title: 'Thành phố', dataIndex: 'city', key: 'city' },
    { title: 'Sao', dataIndex: 'stars', key: 'stars', render: (s: number) => <Tag color="gold">{s} Sao</Tag> },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" type="primary" onClick={() => openRoomsDrawer(record)}>
            Quản lý Phòng
          </Button>
          <Button size="small" icon={<UploadOutlined />} onClick={() => {
            setCurrentUploadHotelId(record.id);
            setFileList([]);
            setUploadHotelModalOpen(true);
          }}>
            Ảnh
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => {
            setEditingHotel(record);
            hotelForm.setFieldsValue(record);
            setHotelModalOpen(true);
          }} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteHotel(record.id)} />
        </Space>
      )
    }
  ];

  const roomColumns = [
    { title: 'Tên phòng', dataIndex: 'name', key: 'name', render: (t: string) => <b>{t}</b> },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (p: number) => `${p?.toLocaleString('vi-VN')}₫` },
    { title: 'Trạng thái', dataIndex: 'available', key: 'available', render: (avail: boolean) => avail ? <Tag color="green">Còn trống</Tag> : <Tag color="red">Đã đặt</Tag> },
    {
      title: 'Ảnh',
      key: 'image',
      render: (_: any, record: any) => (
        <Button size="small" icon={<UploadOutlined />} onClick={() => {
          setCurrentUploadRoomId(record.id);
          setRoomFileList([]);
          setUploadRoomModalOpen(true);
        }}>
          Upload
        </Button>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteRoom(record.id)} />
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>Quản lý Khách sạn</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingHotel(null);
          hotelForm.resetFields();
          setHotelModalOpen(true);
        }}>
          Thêm khách sạn
        </Button>
      </div>

      <Table
        dataSource={hotels}
        columns={hotelColumns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal Thêm/Sửa Khách sạn */}
      <Modal
        title={editingHotel ? "Sửa thông tin khách sạn" : "Thêm khách sạn mới"}
        open={hotelModalOpen}
        onOk={() => hotelForm.submit()}
        onCancel={() => setHotelModalOpen(false)}
        width={700}
      >
        <Form form={hotelForm} layout="vertical" onFinish={handleSaveHotel}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="name" label="Tên khách sạn" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input placeholder="Ví dụ: InterContinental" />
            </Form.Item>
            <Form.Item name="city" label="Thành phố" rules={[{ required: true }]} style={{ width: 150 }}>
              <Input placeholder="Hà Nội" />
            </Form.Item>
            <Form.Item name="stars" label="Hạng sao" rules={[{ required: true }]} style={{ width: 100 }}>
              <Input type="number" min={1} max={5} />
            </Form.Item>
          </div>
          <Form.Item name="address" label="Địa chỉ cụ thể" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="amenities" label="Tiện ích (phân cách bằng dấu phẩy)">
            <Input placeholder="Wifi, Hồ bơi, Spa..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Upload Ảnh Khách sạn */}
      <Modal
        title="Tải ảnh Khách sạn lên"
        open={uploadHotelModalOpen}
        onOk={handleUploadHotelImage}
        onCancel={() => setUploadHotelModalOpen(false)}
        confirmLoading={uploading}
      >
        <Upload
          beforeUpload={() => false}
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList.slice(-1))}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </Modal>

      {/* Drawer Quản lý Phòng */}
      <Drawer
        title={`Quản lý phòng: ${currentHotelForRooms?.name}`}
        placement="right"
        width={800}
        onClose={() => setRoomsDrawerOpen(false)}
        open={roomsDrawerOpen}
      >
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            roomForm.resetFields();
            roomForm.setFieldsValue({ available: true, capacity: 2 });
            setRoomModalOpen(true);
          }}>
            Thêm phòng
          </Button>
        </div>
        <Table
          dataSource={rooms}
          columns={roomColumns}
          rowKey="id"
          loading={loadingRooms}
          pagination={false}
        />
      </Drawer>

      {/* Modal Thêm Phòng */}
      <Modal
        title="Thêm phòng mới"
        open={roomModalOpen}
        onOk={() => roomForm.submit()}
        onCancel={() => setRoomModalOpen(false)}
      >
        <Form form={roomForm} layout="vertical" onFinish={handleSaveRoom}>
          <Form.Item name="name" label="Tên phòng" rules={[{ required: true }]}>
            <Input placeholder="P.101" />
          </Form.Item>
          <Form.Item name="type" label="Loại phòng" rules={[{ required: true }]}>
            <Input placeholder="Deluxe, Standard..." />
          </Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="capacity" label="Sức chứa" rules={[{ required: true }]} style={{ width: 100 }}>
              <Input type="number" min={1} />
            </Form.Item>
          </div>
          <Form.Item name="amenities" label="Tiện ích phòng">
            <Input placeholder="Điều hòa, Tủ lạnh..." />
          </Form.Item>
          <Form.Item name="available" label="Còn trống" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Upload Ảnh Phòng */}
      <Modal
        title="Tải ảnh Phòng lên"
        open={uploadRoomModalOpen}
        onOk={handleUploadRoomImage}
        onCancel={() => setUploadRoomModalOpen(false)}
        confirmLoading={uploading}
      >
        <Upload
          beforeUpload={() => false}
          fileList={roomFileList}
          onChange={({ fileList }) => setRoomFileList(fileList.slice(-1))}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </Modal>

    </div>
  );
};

export default AdminHotels;
