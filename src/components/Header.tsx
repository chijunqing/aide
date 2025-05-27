import React from 'react';
import { Layout, Avatar, Dropdown, Space, Badge } from 'antd';
import { UserOutlined, BellOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">个人资料</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">设置</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <AntHeader
      style={{
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
      }}
    >
      <Space size="large" className="header-right">
        <Badge count={5}>
          <BellOutlined style={{ fontSize: 20 }} />
        </Badge>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <span>张三</span>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header; 