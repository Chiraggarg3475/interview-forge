import React from 'react';
import { Modal, Card, Typography, Tag, Divider, Button, Progress, Space } from 'antd';
import { CloseOutlined, DownloadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getScoreClass } from '../utils/helpers';

const { Title, Paragraph, Text } = Typography;

const ResultsModal = ({ visible, results, onClose }) => {
  if (!results) return null;

  const { score, summary, chatHistory } = results;

  // Calculate additional metrics
  const totalQuestions = chatHistory.length;
  const answeredQuestions = chatHistory.filter(q => q.answer && q.answer.trim() !== '').length;
  const completionRate = Math.round((answeredQuestions / totalQuestions) * 100);

  // Get performance trend (improvement or decline)
  const getPerformanceTrend = () => {
    if (chatHistory.length < 2) return 'insufficient-data';
    
    const firstHalf = chatHistory.slice(0, Math.floor(chatHistory.length / 2));
    const secondHalf = chatHistory.slice(Math.floor(chatHistory.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, item) => sum + item.score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.score, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg) return 'improving';
    if (secondAvg < firstAvg) return 'declining';
    return 'consistent';
  };

  const trend = getPerformanceTrend();

  // Get score description
  const getScoreDescription = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  // Get weak areas for suggestions
  const getWeakAreas = () => {
    const weakQuestions = chatHistory.filter(q => q.score <= 3);
    const difficultyCounts = {
      easy: 0,
      medium: 0,
      hard: 0
    };
    
    weakQuestions.forEach(q => {
      difficultyCounts[q.difficulty]++;
    });
    
    const areas = [];
    if (difficultyCounts.easy > 0) areas.push('React Basics');
    if (difficultyCounts.medium > 0) areas.push('Intermediate Concepts');
    if (difficultyCounts.hard > 0) areas.push('Advanced Topics');
    
    return areas;
  };

  const weakAreas = getWeakAreas();

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
      closeIcon={<CloseOutlined />}
      centered
    >
      <div style={{ padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            📊 Interview Results
          </Title>
          <Text type="secondary">Your performance summary</Text>
        </div>

        <Card style={{ marginBottom: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 16 }}>
              <Progress 
                type="circle" 
                percent={score} 
                width={120}
                strokeColor={
                  score >= 80 ? '#52c41a' : 
                  score >= 60 ? '#1890ff' : 
                  score >= 40 ? '#faad14' : '#ff4d4f'
                }
              />
            </div>
            <Text strong style={{ fontSize: 24 }}>
              Final Score:{' '}
              <span className={getScoreClass(score)}>
                {score}/100
              </span>
            </Text>
            <div style={{ marginTop: 8 }}>
              <Tag color={
                score >= 80 ? 'success' : 
                score >= 60 ? 'processing' : 
                score >= 40 ? 'warning' : 'error'
              }>
                {getScoreDescription(score)}
              </Tag>
              {trend === 'improving' && (
                <Tag color="blue" style={{ marginLeft: 8 }}>
                  <span>📈 Improving</span>
                </Tag>
              )}
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            marginTop: 24,
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Text strong>{answeredQuestions}/{totalQuestions}</Text>
              <br />
              <Text type="secondary">Questions Answered</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text strong>{completionRate}%</Text>
              <br />
              <Text type="secondary">Completion Rate</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <ClockCircleOutlined style={{ fontSize: 16 }} />
              <br />
              <Text type="secondary">Completed</Text>
            </div>
          </div>
        </Card>

        <Card style={{ marginBottom: 24 }}>
          <Title level={4}>Performance Summary</Title>
          <Paragraph>{summary}</Paragraph>
          
          {weakAreas.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Title level={5}>Suggested Focus Areas:</Title>
              <Space wrap>
                {weakAreas.map((area, index) => (
                  <Tag key={index} color="orange">{area}</Tag>
                ))}
              </Space>
              <Paragraph style={{ marginTop: 8, fontSize: '0.9em' }}>
                <Text type="secondary">
                  Based on your performance, we recommend focusing on these areas for improvement.
                </Text>
              </Paragraph>
            </div>
          )}
        </Card>

        <Card>
          <Title level={4}>Question-by-Question Breakdown</Title>
          {chatHistory.map((entry, index) => (
            <div key={index} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text strong>Question {index + 1}</Text>
                <Tag className={`difficulty-tag difficulty-${entry.difficulty}`}>
                  {entry.difficulty}
                </Tag>
              </div>
              <Paragraph>
                <strong>Q:</strong> {entry.question}
              </Paragraph>
              <Paragraph style={{ 
                backgroundColor: '#fafafa', 
                padding: '8px', 
                borderRadius: '4px',
                border: '1px solid #f0f0f0'
              }}>
                <strong>A:</strong> {entry.answer || '[No answer provided]'}
              </Paragraph>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">
                  Score: <span className={getScoreClass(entry.score * 10)}>{entry.score}/10</span>
                </Text>
                <Text type="secondary">
                  Time: {entry.timeTaken || 0}s
                </Text>
              </div>
              {index < chatHistory.length - 1 && <Divider style={{ margin: '16px 0' }} />}
            </div>
          ))}
        </Card>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary">
            Thank you for completing the interview! Check the Interviewer Dashboard to see detailed results.
          </Text>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Space>
            <Button type="primary" onClick={onClose} size="large">
              Close Results
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={() => {
                // Placeholder for export functionality
                alert('Export feature would be implemented here');
              }}
            >
              Export as PDF
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default ResultsModal;