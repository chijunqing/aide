import React, { useState } from 'react';
import { Card, Progress, Space, Button, Timeline, Statistic, Row, Col } from 'antd';
import { HeartOutlined, SmileOutlined, CoffeeOutlined, ClockCircleOutlined } from '@ant-design/icons';

const HealthCare: React.FC = () => {
  const [moodData] = useState({
    current: 85,
    average: 78,
    trend: 'up',
  });

  const [healthData] = useState({
    sleep: 7.5,
    exercise: 45,
    water: 2000,
    steps: 8000,
  });

  return (
    <div>
      <h2>情绪与健康关怀</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="今日情绪">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card>
                <Statistic
                  title="当前情绪指数"
                  value={moodData.current}
                  suffix="/100"
                  valueStyle={{ color: '#3f8600' }}
                />
                <Progress percent={moodData.current} showInfo={false} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="本周平均情绪"
                  value={moodData.average}
                  suffix="/100"
                  valueStyle={{ color: '#1890ff' }}
                />
                <Progress percent={moodData.average} showInfo={false} />
              </Card>
            </Col>
          </Row>
        </Card>

        <Card title="健康指标">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card>
                <Space>
                  <CoffeeOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                  <Statistic
                    title="睡眠时长"
                    value={healthData.sleep}
                    suffix="小时"
                  />
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Space>
                  <HeartOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
                  <Statistic
                    title="运动时长"
                    value={healthData.exercise}
                    suffix="分钟"
                  />
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Space>
                  <SmileOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                  <Statistic
                    title="饮水量"
                    value={healthData.water}
                    suffix="ml"
                  />
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Space>
                  <ClockCircleOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                  <Statistic
                    title="步数"
                    value={healthData.steps}
                    suffix="步"
                  />
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>

        <Card title="情绪记录">
          <Timeline
            items={[
              {
                color: 'green',
                children: '09:00 开始工作，心情愉悦',
              },
              {
                color: 'blue',
                children: '12:00 午休时间，放松休息',
              },
              {
                color: 'orange',
                children: '15:00 项目进展顺利，充满干劲',
              },
              {
                color: 'green',
                children: '18:00 完成今日工作，心情舒畅',
              },
            ]}
          />
        </Card>

        <Card title="健康建议">
          <Space direction="vertical" style={{ width: '100%' }}>
            {[
              { title: '注意休息', content: '建议每工作1小时休息10分钟' },
              { title: '保持运动', content: '建议每天进行30分钟有氧运动' },
              { title: '规律作息', content: '建议保持7-8小时的睡眠时间' },
            ].map((item, index) => (
              <Card key={index} size="small" style={{ marginBottom: 8 }}>
                <Space direction="vertical">
                  <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                  <div>{item.content}</div>
                </Space>
              </Card>
            ))}
          </Space>
        </Card>

        <Card title="快捷功能">
          <Space>
            <Button type="primary" icon={<HeartOutlined />}>
              记录情绪
            </Button>
            <Button icon={<CoffeeOutlined />}>健康打卡</Button>
            <Button>查看报告</Button>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default HealthCare; 