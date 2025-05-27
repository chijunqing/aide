import React, { useState } from 'react';
import { Card, Input, Button, Space, Select, Table, Tag } from 'antd';
import { FileTextOutlined, MailOutlined, FilePptOutlined, EditOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

interface CreativeProject {
  key: string;
  title: string;
  type: string;
  status: string;
  date: string;
  progress: number;
}

const CreativeAssistant: React.FC = () => {
  const [projects] = useState<CreativeProject[]>([
    {
      key: '1',
      title: '项目周报',
      type: '报告',
      status: '进行中',
      date: '2024-03-20',
      progress: 60,
    },
    {
      key: '2',
      title: '产品介绍PPT',
      type: '演示文稿',
      status: '待开始',
      date: '2024-03-21',
      progress: 0,
    },
  ]);

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const color = type === '报告' ? 'blue' : type === '演示文稿' ? 'green' : 'orange';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === '进行中' ? 'processing' : status === '已完成' ? 'success' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => `${progress}%`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CreativeProject) => (
        <Space size="middle">
          <Button type="link">编辑</Button>
          <Button type="link">预览</Button>
          <Button type="link">导出</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>创意辅助</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="内容生成">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Select defaultValue="report" style={{ width: '100%' }}>
              <Option value="report">生成报告</Option>
              <Option value="email">生成邮件</Option>
              <Option value="ppt">生成PPT</Option>
              <Option value="article">生成文章</Option>
            </Select>
            <TextArea
              placeholder="请输入内容主题或关键词"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
            <Space>
              <Button type="primary">生成内容</Button>
              <Button>优化内容</Button>
              <Button>调整风格</Button>
            </Space>
          </Space>
        </Card>

        <Card title="项目列表">
          <Table columns={columns} dataSource={projects} />
        </Card>

        <Card title="快捷功能">
          <Space wrap>
            <Button icon={<FileTextOutlined />}>生成报告</Button>
            <Button icon={<MailOutlined />}>生成邮件</Button>
            <Button icon={<FilePptOutlined />}>生成PPT</Button>
            <Button icon={<EditOutlined />}>文案润色</Button>
          </Space>
        </Card>

        <Card title="创作模板">
          <Space direction="vertical" style={{ width: '100%' }}>
            {[
              { title: '周报模板', type: '报告', description: '适用于项目周报、工作总结等' },
              { title: '邮件模板', type: '邮件', description: '适用于工作邮件、通知等' },
              { title: 'PPT模板', type: '演示文稿', description: '适用于产品介绍、项目汇报等' },
            ].map((item, index) => (
              <Card key={index} size="small" style={{ marginBottom: 8 }}>
                <Space direction="vertical">
                  <Space>
                    <span style={{ fontWeight: 'bold' }}>{item.title}</span>
                    <Tag color="blue">{item.type}</Tag>
                  </Space>
                  <div style={{ color: '#666' }}>{item.description}</div>
                </Space>
              </Card>
            ))}
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default CreativeAssistant; 