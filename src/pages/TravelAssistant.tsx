import React, { useState } from 'react';
import { Card, Input, DatePicker, Select, Button, Space, Table, Tag, Row, Col } from 'antd';
import { SearchOutlined, EnvironmentOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TravelPlan {
  key: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: string;
  budget: string;
  participants: number;
}

const TravelAssistant: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const travelPlans: TravelPlan[] = [
    {
      key: '1',
      destination: '东京',
      startDate: '2024-04-01',
      endDate: '2024-04-05',
      status: '已确认',
      budget: '¥15,000',
      participants: 2,
    },
    {
      key: '2',
      destination: '巴黎',
      startDate: '2024-05-15',
      endDate: '2024-05-20',
      status: '计划中',
      budget: '¥20,000',
      participants: 4,
    },
  ];

  const columns = [
    {
      title: '目的地',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: '日期',
      key: 'date',
      render: (record: TravelPlan) => (
        <Space>
          <CalendarOutlined />
          {record.startDate} 至 {record.endDate}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === '已确认' ? 'success' : 'processing';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
    },
    {
      title: '人数',
      key: 'participants',
      render: (record: TravelPlan) => (
        <Space>
          <TeamOutlined />
          {record.participants}人
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link">查看详情</Button>
          <Button type="link">编辑</Button>
        </Space>
      ),
    },
  ];

  const popularDestinations = [
    { name: '东京', country: '日本', image: 'https://picsum.photos/200/150?random=1' },
    { name: '巴黎', country: '法国', image: 'https://picsum.photos/200/150?random=2' },
    { name: '纽约', country: '美国', image: 'https://picsum.photos/200/150?random=3' },
    { name: '伦敦', country: '英国', image: 'https://picsum.photos/200/150?random=4' },
  ];

  return (
    <div>
      <h2>旅行助手</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Row gutter={16}>
              <Col span={8}>
                <Input
                  placeholder="搜索目的地"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
              </Col>
              <Col span={8}>
                <Select
                  placeholder="选择城市"
                  style={{ width: '100%' }}
                  value={selectedCity}
                  onChange={setSelectedCity}
                >
                  <Option value="tokyo">东京</Option>
                  <Option value="paris">巴黎</Option>
                  <Option value="newyork">纽约</Option>
                  <Option value="london">伦敦</Option>
                </Select>
              </Col>
              <Col span={8}>
                <RangePicker style={{ width: '100%' }} />
              </Col>
            </Row>
            <Button type="primary" icon={<SearchOutlined />}>
              搜索行程
            </Button>
          </Space>
        </Card>

        <Card title="热门目的地">
          <Row gutter={[16, 16]}>
            {popularDestinations.map((destination, index) => (
              <Col span={6} key={index}>
                <Card
                  hoverable
                  cover={<img alt={destination.name} src={destination.image} />}
                >
                  <Card.Meta
                    title={destination.name}
                    description={destination.country}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        <Card title="我的行程">
          <Table
            columns={columns}
            dataSource={travelPlans}
            pagination={false}
          />
        </Card>

        <Card title="旅行建议">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card size="small">
              <Space>
                <EnvironmentOutlined />
                <span>最佳旅行时间：春季（3-5月）和秋季（9-11月）</span>
              </Space>
            </Card>
            <Card size="small">
              <Space>
                <TeamOutlined />
                <span>建议提前3个月预订机票和酒店</span>
              </Space>
            </Card>
            <Card size="small">
              <Space>
                <CalendarOutlined />
                <span>热门景点建议提前预约门票</span>
              </Space>
            </Card>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default TravelAssistant; 