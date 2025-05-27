import React, { useState } from 'react';
import { Card, Input, Select, Button, Space, Table, Tag } from 'antd';
import { SwapOutlined, HistoryOutlined, StarOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

interface TranslationHistory {
  key: string;
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  date: string;
}

const TranslationAssistant: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [sourceLang, setSourceLang] = useState('zh');
  const [targetLang, setTargetLang] = useState('en');

  const history: TranslationHistory[] = [
    {
      key: '1',
      sourceText: '你好，世界！',
      targetText: 'Hello, World!',
      sourceLang: 'zh',
      targetLang: 'en',
      date: '2024-03-20 15:30',
    },
    {
      key: '2',
      sourceText: 'こんにちは、世界！',
      targetText: '你好，世界！',
      sourceLang: 'ja',
      targetLang: 'zh',
      date: '2024-03-20 14:20',
    },
  ];

  const columns = [
    {
      title: '原文',
      dataIndex: 'sourceText',
      key: 'sourceText',
    },
    {
      title: '译文',
      dataIndex: 'targetText',
      key: 'targetText',
    },
    {
      title: '语言',
      key: 'language',
      render: (record: TranslationHistory) => (
        <Space>
          <Tag color="blue">{record.sourceLang.toUpperCase()}</Tag>
          <SwapOutlined />
          <Tag color="green">{record.targetLang.toUpperCase()}</Tag>
        </Space>
      ),
    },
    {
      title: '时间',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" icon={<StarOutlined />}>收藏</Button>
          <Button type="link">复制</Button>
        </Space>
      ),
    },
  ];

  const handleTranslate = () => {
    // 模拟翻译功能
    setTargetText('翻译结果将显示在这里...');
  };

  const handleSwapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    const tempText = sourceText;
    setSourceText(targetText);
    setTargetText(tempText);
  };

  return (
    <div>
      <h2>翻译助手</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Select
                value={sourceLang}
                onChange={setSourceLang}
                style={{ width: 120 }}
              >
                <Option value="zh">中文</Option>
                <Option value="en">英语</Option>
                <Option value="ja">日语</Option>
                <Option value="ko">韩语</Option>
              </Select>
              <Button
                icon={<SwapOutlined />}
                onClick={handleSwapLanguages}
              />
              <Select
                value={targetLang}
                onChange={setTargetLang}
                style={{ width: 120 }}
              >
                <Option value="zh">中文</Option>
                <Option value="en">英语</Option>
                <Option value="ja">日语</Option>
                <Option value="ko">韩语</Option>
              </Select>
            </Space>
            <TextArea
              value={sourceText}
              onChange={e => setSourceText(e.target.value)}
              placeholder="请输入要翻译的文本"
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
            <Button type="primary" onClick={handleTranslate}>
              翻译
            </Button>
            <TextArea
              value={targetText}
              readOnly
              placeholder="翻译结果"
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </Space>
        </Card>

        <Card title={<Space><HistoryOutlined />翻译历史</Space>}>
          <Table
            columns={columns}
            dataSource={history}
            pagination={false}
          />
        </Card>
      </Space>
    </div>
  );
};

export default TranslationAssistant; 