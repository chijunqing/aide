import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  FileTextOutlined,
  MailOutlined,
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  HeartOutlined,
  BulbOutlined,
  TranslationOutlined,
  CarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: '文档智能助手',
      icon: <FileTextOutlined style={{ fontSize: '24px' }} />,
      path: '/document',
      value: '12',
      suffix: '个待处理文档',
    },
    {
      title: '智能邮件助手',
      icon: <MailOutlined style={{ fontSize: '24px' }} />,
      path: '/email',
      value: '5',
      suffix: '封未读邮件',
    },
    {
      title: '个人知识库',
      icon: <BookOutlined style={{ fontSize: '24px' }} />,
      path: '/knowledge',
      value: '28',
      suffix: '条新知识',
    },
    {
      title: '智能工作规划',
      icon: <CalendarOutlined style={{ fontSize: '24px' }} />,
      path: '/planner',
      value: '3',
      suffix: '个待办任务',
    },
    {
      title: '会议智能助理',
      icon: <TeamOutlined style={{ fontSize: '24px' }} />,
      path: '/meeting',
      value: '2',
      suffix: '个待处理会议',
    },
    {
      title: '情绪与健康',
      icon: <HeartOutlined style={{ fontSize: '24px' }} />,
      path: '/health',
      value: '良好',
      suffix: '当前状态',
    },
    {
      title: '创意辅助',
      icon: <BulbOutlined style={{ fontSize: '24px' }} />,
      path: '/creative',
      value: '4',
      suffix: '个创意项目',
    },
    {
      title: '翻译助手',
      icon: <TranslationOutlined style={{ fontSize: '24px' }} />,
      path: '/translation',
      value: '8',
      suffix: '次翻译记录',
    },
    {
      title: '智能出行',
      icon: <CarOutlined style={{ fontSize: '24px' }} />,
      path: '/travel',
      value: '1',
      suffix: '个待出行计划',
    },
  ];

  return (
    <div>
      <h2>工作台</h2>
      <Row gutter={[16, 16]}>
        {features.map((feature) => (
          <Col xs={24} sm={12} md={8} lg={6} key={feature.path}>
            <Card
              hoverable
              onClick={() => navigate(feature.path)}
              style={{ height: '100%' }}
            >
              <Statistic
                title={feature.title}
                value={feature.value}
                suffix={feature.suffix}
                prefix={feature.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard; 