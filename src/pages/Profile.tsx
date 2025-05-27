import React from 'react';
import { Card, Avatar, Row, Col, Statistic, List, Tag, Button, Space, Divider } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

const Profile: React.FC = () => {
  const userInfo = {
    name: '张三',
    avatar: 'https://joeschmoe.io/api/v1/random',
    role: '高级产品经理',
    department: '产品部',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    joinDate: '2023-01-15',
  };

  const statistics = [
    { title: '项目数量', value: 12, icon: <FileTextOutlined /> },
    { title: '团队人数', value: 8, icon: <TeamOutlined /> },
    { title: '工作时长', value: '2年', icon: <ClockCircleOutlined /> },
    { title: '获得成就', value: 5, icon: <TrophyOutlined /> },
  ];

  const recentActivities = [
    {
      title: '完成项目周报',
      time: '2024-03-20 14:30',
      type: '文档',
    },
    {
      title: '参加产品评审会',
      time: '2024-03-19 10:00',
      type: '会议',
    },
    {
      title: '更新项目进度',
      time: '2024-03-18 16:45',
      type: '任务',
    },
  ];

  const skills = [
    { name: '产品设计', level: '精通' },
    { name: '项目管理', level: '熟练' },
    { name: '数据分析', level: '熟练' },
    { name: '团队协作', level: '精通' },
  ];

  return (
    <div>
      <h2>个人资料</h2>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                src={userInfo.avatar}
                icon={<UserOutlined />}
              />
              <h3 style={{ marginTop: 16 }}>{userInfo.name}</h3>
              <p>{userInfo.role}</p>
              <Tag color="blue">{userInfo.department}</Tag>
            </div>
            <Divider />
            <List
              dataSource={[
                { icon: <MailOutlined />, text: userInfo.email },
                { icon: <PhoneOutlined />, text: userInfo.phone },
                { icon: <ClockCircleOutlined />, text: `入职时间：${userInfo.joinDate}` },
              ]}
              renderItem={item => (
                <List.Item>
                  <Space>
                    {item.icon}
                    {item.text}
                  </Space>
                </List.Item>
              )}
            />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Button type="primary">编辑资料</Button>
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Card title="工作统计">
            <Row gutter={16}>
              {statistics.map((stat, index) => (
                <Col span={6} key={index}>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.icon}
                  />
                </Col>
              ))}
            </Row>
          </Card>

          <Card title="技能标签" style={{ marginTop: 16 }}>
            <Space wrap>
              {skills.map((skill, index) => (
                <Tag key={index} color={skill.level === '精通' ? 'blue' : 'green'}>
                  {skill.name} - {skill.level}
                </Tag>
              ))}
            </Space>
          </Card>

          <Card title="最近活动" style={{ marginTop: 16 }}>
            <List
              dataSource={recentActivities}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={item.time}
                  />
                  <Tag color="blue">{item.type}</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile; 