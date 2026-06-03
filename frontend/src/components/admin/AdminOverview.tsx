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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [chartData, setChartData] = useState<any[]>([]);

  const pieData = [
    { name: 'Chờ duyệt', value: stats?.pendingBookings || 4 },
    { name: 'Đã xác nhận', value: (stats?.totalBookings || 24) - (stats?.pendingBookings || 4) },
  ];
  const COLORS = ['#faad14', '#52c41a', '#ff4d4f'];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOverview();
      setStats(res.data);

      const bookingsRes = await adminApi.getBookings();
      const bookings = bookingsRes.data || [];
      
      const months = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return {
          month: d.getMonth() + 1,
          year: d.getFullYear(),
          name: `Tháng ${d.getMonth() + 1}`,
          revenue: 0
        };
      });

      bookings.forEach((b: any) => {
        if (b.status === 'CONFIRMED' || b.paymentStatus === 'PAID') {
          const date = new Date(b.checkInDate || b.createdAt);
          const m = date.getMonth() + 1;
          const y = date.getFullYear();
          
          const targetMonth = months.find(x => x.month === m && x.year === y);
          if (targetMonth) {
            targetMonth.revenue += (b.totalPrice || 0);
          }
        }
      });
      setChartData(months);
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
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', background: 'linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%)' }}>
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#595959' }}>Tổng doanh thu</span>}
              value={stats?.totalRevenue || 0}
              precision={0}
              valueStyle={{ color: '#3f8600', fontWeight: 800, fontSize: 28 }}
              prefix={<DollarOutlined />}
              suffix="₫"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#595959' }}>Tổng số Booking</span>}
              value={stats?.totalBookings || 0}
              valueStyle={{ color: '#006ce4', fontWeight: 800, fontSize: 28 }}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#595959' }}>Booking chờ duyệt</span>}
              value={stats?.pendingBookings || 0}
              valueStyle={{ color: '#faad14', fontWeight: 800, fontSize: 28 }}
              prefix={<ReconciliationOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Statistic
              title={<span style={{ fontWeight: 600, color: '#595959' }}>Yêu cầu cần xử lý</span>}
              value={stats?.pendingRequests || 0}
              valueStyle={{ color: '#cf1322', fontWeight: 800, fontSize: 28 }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card 
            bordered={false} 
            style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            title={<span style={{ fontSize: 16, fontWeight: 700 }}>Biểu đồ Doanh thu (6 tháng gần nhất)</span>}
          >
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8c8c8c'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#8c8c8c'}} tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip 
                    formatter={(value: any) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value))}
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            bordered={false} 
            style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            title={<span style={{ fontSize: 16, fontWeight: 700 }}>Tỉ lệ Đặt phòng</span>}
          >
            <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminOverview;
