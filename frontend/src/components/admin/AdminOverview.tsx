import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Button, message, Spin } from 'antd';
import {
  FileExcelOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  ReconciliationOutlined
} from '@ant-design/icons';
import { adminApi } from '../../api';

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOverview();
      setStats(res.data);
    } catch (error) {
      message.error('Không thể tải dữ liệu thống kê');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      const token = localStorage.getItem('token');
      // Tải file dạng blob để xử lý Auth header
      const response = await fetch('http://localhost:8080/admin/reports/bookings.xlsx', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to export');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings_report_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      message.success('Xuất báo cáo Excel thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xuất báo cáo');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>Tổng quan hệ thống</h2>
        <Button 
          type="primary" 
          icon={<FileExcelOutlined />} 
          onClick={handleExportExcel}
          loading={exporting}
          style={{ background: '#107c41', borderColor: '#107c41' }}
        >
          Xuất Báo Cáo Excel
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Tổng doanh thu"
              value={stats?.totalRevenue || 0}
              precision={0}
              valueStyle={{ color: '#3f8600', fontWeight: 600 }}
              prefix={<DollarOutlined />}
              suffix="₫"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Tổng số Booking"
              value={stats?.totalBookings || 0}
              valueStyle={{ color: '#006ce4', fontWeight: 600 }}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Booking chờ duyệt"
              value={stats?.pendingBookings || 0}
              valueStyle={{ color: '#faad14', fontWeight: 600 }}
              prefix={<ReconciliationOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Yêu cầu cần xử lý"
              value={stats?.pendingRequests || 0}
              valueStyle={{ color: '#cf1322', fontWeight: 600 }}
              prefix={<UserOutlined />} // Icon tạm
            />
          </Card>
        </Col>
      </Row>
      
      {/* Có thể mở rộng vẽ biểu đồ ở đây nếu có thư viện */}
    </div>
  );
};

export default AdminOverview;
