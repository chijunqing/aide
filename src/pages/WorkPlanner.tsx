import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, Progress, Calendar, Statistic } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

interface Task {
  key: string;
  title: string;
  priority: string;
  status: string;
  progress: number;
  deadline: string;
  assignee: string;
}

const WorkPlanner: React.FC = () => {
  const [tasks] = useState<Task[]>([
    {
      key: '1',
      title: '完成项目需求文档',
      priority: '高',
      status: '进行中',
      progress: 60,
      deadline: '2024-03-25',
      assignee: '张三',
    },
    {
      key: '2',
      title: '开发新功能模块',
      priority: '中',
      status: '待开始',
      progress: 0,
      deadline: '2024-03-28',
      assignee: '李四',
    },
    {
      key: '3',
      title: '代码审查',
      priority: '高',
      status: '已完成',
      progress: 100,
      deadline: '2024-03-20',
      assignee: '王五',
    },
  ]);

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === '进行中' ? 'processing' : status === '已完成' ? 'success' : 'default';
        const icon = status === '进行中' ? <ClockCircleOutlined /> : 
                    status === '已完成' ? <CheckCircleOutlined /> : 
                    <ExclamationCircleOutlined />;
        return <Tag icon={icon} color={color}>{status}</Tag>;
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      ),
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Task) => (
        <Space size="middle">
          <Button type="link">编辑</Button>
          <Button type="link">详情</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>智能工作规划</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="任务概览">
          <Space size="large">
            <Card size="small">
              <Statistic title="总任务数" value={12} />
            </Card>
            <Card size="small">
              <Statistic title="进行中" value={5} valueStyle={{ color: '#1890ff' }} />
            </Card>
            <Card size="small">
              <Statistic title="已完成" value={4} valueStyle={{ color: '#52c41a' }} />
            </Card>
            <Card size="small">
              <Statistic title="待开始" value={3} valueStyle={{ color: '#faad14' }} />
            </Card>
          </Space>
        </Card>

        <Card title="任务列表">
          <Table columns={columns} dataSource={tasks} />
        </Card>

        <Card title="日程安排">
          <Calendar fullscreen={false} />
        </Card>

        <Card title="风险预警">
          <Space direction="vertical" style={{ width: '100%' }}>
            {[
              { title: '项目文档即将到期', level: '高', date: '2024-03-25' },
              { title: '代码审查任务积压', level: '中', date: '2024-03-22' },
            ].map((item, index) => (
              <Card key={index} size="small" style={{ marginBottom: 8 }}>
                <Space>
                  <ExclamationCircleOutlined style={{ color: item.level === '高' ? '#ff4d4f' : '#faad14' }} />
                  <span>{item.title}</span>
                  <Tag color={item.level === '高' ? 'red' : 'orange'}>{item.level}风险</Tag>
                  <span style={{ color: '#999' }}>截止日期：{item.date}</span>
                </Space>
              </Card>
            ))}
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default WorkPlanner; 