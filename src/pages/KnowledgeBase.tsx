import React, { useState } from 'react';
import { Card, Tree, Input, Button, Space, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, BookOutlined } from '@ant-design/icons';

const { Search } = Input;

interface KnowledgeNode {
  key: string;
  title: string;
  children?: KnowledgeNode[];
}

const KnowledgeBase: React.FC = () => {
  const [treeData] = useState<KnowledgeNode[]>([
    {
      key: '1',
      title: '工作文档',
      children: [
        {
          key: '1-1',
          title: '项目文档',
          children: [
            { key: '1-1-1', title: '需求文档' },
            { key: '1-1-2', title: '设计文档' },
          ],
        },
        {
          key: '1-2',
          title: '会议记录',
          children: [
            { key: '1-2-1', title: '周会记录' },
            { key: '1-2-2', title: '项目评审' },
          ],
        },
      ],
    },
    {
      key: '2',
      title: '学习资料',
      children: [
        {
          key: '2-1',
          title: '技术文档',
          children: [
            { key: '2-1-1', title: '前端开发' },
            { key: '2-1-2', title: '后端开发' },
          ],
        },
        {
          key: '2-2',
          title: '业务知识',
          children: [
            { key: '2-2-1', title: '产品设计' },
            { key: '2-2-2', title: '项目管理' },
          ],
        },
      ],
    },
  ]);

  return (
    <div>
      <h2>个人知识库</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space style={{ marginBottom: 16 }}>
            <Search
              placeholder="搜索知识库"
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Button type="primary" icon={<PlusOutlined />}>
              新建知识
            </Button>
          </Space>
        </Card>

        <Card title="知识分类">
          <Tree
            treeData={treeData}
            defaultExpandAll
            style={{ marginBottom: 16 }}
          />
        </Card>

        <Card title="最近更新">
          <Space direction="vertical" style={{ width: '100%' }}>
            {[
              { title: '项目需求文档', category: '工作文档', date: '2024-03-20' },
              { title: '前端开发指南', category: '技术文档', date: '2024-03-19' },
              { title: '产品设计规范', category: '业务知识', date: '2024-03-18' },
            ].map((item, index) => (
              <Card key={index} size="small" style={{ marginBottom: 8 }}>
                <Space>
                  <BookOutlined />
                  <span>{item.title}</span>
                  <Tag color="blue">{item.category}</Tag>
                  <span style={{ color: '#999' }}>{item.date}</span>
                </Space>
              </Card>
            ))}
          </Space>
        </Card>

        <Card title="知识图谱">
          <div style={{ height: 300, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            知识图谱可视化区域
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default KnowledgeBase; 