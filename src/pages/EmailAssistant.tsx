import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, Input, Select } from 'antd';
import { MailOutlined, SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

interface Email {
  key: string;
  subject: string;
  sender: string;
  category: string;
  priority: string;
  date: string;
  status: string;
}

const EmailAssistant: React.FC = () => {
  const [emails] = useState<Email[]>([
    {
      key: '1',
      subject: '项目进度报告',
      sender: 'zhang.san@company.com',
      category: '工作',
      priority: '高',
      date: '2024-03-20 10:30',
      status: '未读',
    },
    {
      key: '2',
      subject: '会议邀请',
      sender: 'li.si@company.com',
      category: '会议',
      priority: '中',
      date: '2024-03-20 09:15',
      status: '已读',
    },
  ]);

  const columns = [
    {
      title: '主题',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: '发件人',
      dataIndex: 'sender',
      key: 'sender',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const color = category === '工作' ? 'blue' : category === '会议' ? 'green' : 'orange';
        return <Tag color={color}>{category}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const color = priority === '高' ? 'red' : priority === '中' ? 'orange' : 'green';
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === '未读' ? 'blue' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Email) => (
        <Space size="middle">
          <Button type="link">查看</Button>
          <Button type="link">回复</Button>
          <Button type="link">归档</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>智能邮件助手</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space style={{ marginBottom: 16 }}>
            <Search
              placeholder="搜索邮件"
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部分类</Option>
              <Option value="work">工作</Option>
              <Option value="meeting">会议</Option>
              <Option value="other">其他</Option>
            </Select>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">全部状态</Option>
              <Option value="unread">未读</Option>
              <Option value="read">已读</Option>
            </Select>
          </Space>
        </Card>

        <Card title="邮件列表">
          <Table columns={columns} dataSource={emails} />
        </Card>

        <Card title="快捷功能">
          <Space>
            <Button icon={<MailOutlined />}>写邮件</Button>
            <Button>智能分类</Button>
            <Button>邮件分析</Button>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default EmailAssistant; 