import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  MailOutlined,
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  HeartOutlined,
  EditOutlined,
  TranslationOutlined,
  GlobalOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">仪表盘</Link>,
    },
    {
      key: '/document',
      icon: <FileTextOutlined />,
      label: <Link to="/document">文档助手</Link>,
    },
    {
      key: '/email',
      icon: <MailOutlined />,
      label: <Link to="/email">邮件助手</Link>,
    },
    {
      key: '/knowledge',
      icon: <BookOutlined />,
      label: <Link to="/knowledge">知识库</Link>,
    },
    {
      key: '/work',
      icon: <CalendarOutlined />,
      label: <Link to="/work">工作计划</Link>,
    },
    {
      key: '/meeting',
      icon: <TeamOutlined />,
      label: <Link to="/meeting">会议助手</Link>,
    },
    {
      key: '/health',
      icon: <HeartOutlined />,
      label: <Link to="/health">健康关怀</Link>,
    },
    {
      key: '/creative',
      icon: <EditOutlined />,
      label: <Link to="/creative">创意助手</Link>,
    },
    {
      key: '/translation',
      icon: <TranslationOutlined />,
      label: <Link to="/translation">翻译助手</Link>,
    },
    {
      key: '/travel',
      icon: <GlobalOutlined />,
      label: <Link to="/travel">旅行助手</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">个人资料</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">设置</Link>,
    },
  ];

  return (
    <Sider
      theme="light"
      width={250}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div style={{ height: 64, padding: '16px', textAlign: 'center' }}>
        <h2 style={{ margin: 0 }}>智能助手</h2>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar; 