import React, { useState } from 'react';
import { Card, Upload, Button, message, Space, Table, Tag } from 'antd';
import { UploadOutlined, FileWordOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;

interface Document {
  key: string;
  name: string;
  type: string;
  size: string;
  status: string;
  date: string;
}

const DocumentAssistant: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      key: '1',
      name: '项目报告.docx',
      type: 'Word',
      size: '2.5MB',
      status: '待处理',
      date: '2024-03-20',
    },
    {
      key: '2',
      name: '数据分析.xlsx',
      type: 'Excel',
      size: '1.8MB',
      status: '处理中',
      date: '2024-03-19',
    },
  ]);

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const color = type === 'Word' ? 'blue' : type === 'Excel' ? 'green' : 'red';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === '待处理' ? 'default' : status === '处理中' ? 'processing' : 'success';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Document) => (
        <Space size="middle">
          <Button type="link">查看</Button>
          <Button type="link">处理</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      ),
    },
  ];

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/upload',
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return (
    <div>
      <h2>文档智能助手</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="文档上传">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持 Word、Excel、PDF 等格式文件
            </p>
          </Dragger>
        </Card>

        <Card title="文档列表">
          <Table columns={columns} dataSource={documents} />
        </Card>

        <Card title="快捷功能">
          <Space>
            <Button icon={<FileWordOutlined />}>Word转PDF</Button>
            <Button icon={<FileExcelOutlined />}>Excel分析</Button>
            <Button icon={<FilePdfOutlined />}>PDF处理</Button>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default DocumentAssistant; 