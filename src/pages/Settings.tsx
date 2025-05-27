import React, { useState } from 'react';
import { Card, Form, Input, Switch, Select, Button, Space, Divider, message } from 'antd';
import { UserOutlined, BellOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';

const { Option } = Select;

interface SettingsForm {
  name: string;
  email: string;
  language: string;
  theme: string;
  notifications: {
    email: boolean;
    desktop: boolean;
    sound: boolean;
  };
  security: {
    twoFactor: boolean;
    autoLogout: boolean;
  };
}

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const initialValues: SettingsForm = {
    name: '张三',
    email: 'zhangsan@example.com',
    language: 'zh_CN',
    theme: 'light',
    notifications: {
      email: true,
      desktop: true,
      sound: false,
    },
    security: {
      twoFactor: false,
      autoLogout: true,
    },
  };

  const handleSubmit = async (values: SettingsForm) => {
    setLoading(true);
    try {
      // 模拟保存设置
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('设置已保存');
    } catch (error) {
      message.error('保存设置失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>设置</h2>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <Card title={<Space><UserOutlined />个人信息</Space>}>
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Card>

        <Divider />

        <Card title={<Space><GlobalOutlined />界面设置</Space>}>
          <Form.Item name="language" label="语言">
            <Select>
              <Option value="zh_CN">简体中文</Option>
              <Option value="en_US">English</Option>
            </Select>
          </Form.Item>
          <Form.Item name="theme" label="主题">
            <Select>
              <Option value="light">浅色</Option>
              <Option value="dark">深色</Option>
              <Option value="system">跟随系统</Option>
            </Select>
          </Form.Item>
        </Card>

        <Divider />

        <Card title={<Space><BellOutlined />通知设置</Space>}>
          <Form.Item name={['notifications', 'email']} label="邮件通知" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name={['notifications', 'desktop']} label="桌面通知" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name={['notifications', 'sound']} label="声音提醒" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>

        <Divider />

        <Card title={<Space><LockOutlined />安全设置</Space>}>
          <Form.Item name={['security', 'twoFactor']} label="两步验证" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name={['security', 'autoLogout']} label="自动登出" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>

        <Divider />

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存设置
            </Button>
            <Button onClick={() => form.resetFields()}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Settings; 