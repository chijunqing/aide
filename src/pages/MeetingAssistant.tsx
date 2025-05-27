import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, Input, Select, Timeline } from 'antd';
import { SearchOutlined, VideoCameraOutlined, AudioOutlined, FileTextOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

interface Meeting {
  key: string;
  title: string;
  type: string;
  status: string;
  date: string;
  participants: string;
  duration: string;
}

const MeetingAssistant: React.FC = () => {
  const [meetings] = useState<Meeting[]>([
    {
      key: '1',
      title: '项目周会',
      type: '视频会议',
      status: '进行中',
      date: '2024-03-20 14:00',
      participants: '8人',
      duration: '1小时',
    },
    {
      key: '2',
      title: '产品评审会',
      type: '线下会议',
      status: '待开始',
      date: '2024-03-21 10:00',
      participants: '5人',
      duration: '2小时',
    },
  ]);

  const columns = [
    {
      title: '会议主题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '会议类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const color = type === '视频会议' ? 'blue' : 'green';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === '进行中' ? 'processing' : status === '已结束' ? 'default' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '时间',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '参会人数',
      dataIndex: 'participants',
      key: 'participants',
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Meeting) => (
        <Space size="middle">
          <Button type="link">加入</Button>
          <Button type="link">详情</Button>
          <Button type="link">纪要</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>会议智能助理</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space style={{ marginBottom: 16 }}>
            <Search
              placeholder="搜索会议"
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部类型</Option>
              <Option value="video">视频会议</Option>
              <Option value="offline">线下会议</Option>
            </Select>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部状态</Option>
              <Option value="ongoing">进行中</Option>
              <Option value="upcoming">待开始</Option>
              <Option value="ended">已结束</Option>
            </Select>
            <Button type="primary">新建会议</Button>
          </Space>
        </Card>

        <Card title="会议列表">
          <Table columns={columns} dataSource={meetings} />
        </Card>

        <Card title="今日会议">
          <Timeline
            items={[
              {
                color: 'blue',
                children: '14:00 项目周会（视频会议）',
              },
              {
                color: 'green',
                children: '16:00 技术分享会（线下会议）',
              },
            ]}
          />
        </Card>

        <Card title="会议纪要">
          <Space direction="vertical" style={{ width: '100%' }}>
            {[
              { title: '项目周会纪要', date: '2024-03-20', type: '视频会议' },
              { title: '产品评审会纪要', date: '2024-03-19', type: '线下会议' },
            ].map((item, index) => (
              <Card key={index} size="small" style={{ marginBottom: 8 }}>
                <Space>
                  <FileTextOutlined />
                  <span>{item.title}</span>
                  <Tag color="blue">{item.type}</Tag>
                  <span style={{ color: '#999' }}>{item.date}</span>
                </Space>
              </Card>
            ))}
          </Space>
        </Card>

        <Card title="快捷功能">
          <Space>
            <Button icon={<VideoCameraOutlined />}>发起视频会议</Button>
            <Button icon={<AudioOutlined />}>语音转文字</Button>
            <Button icon={<FileTextOutlined />}>生成会议纪要</Button>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default MeetingAssistant; 