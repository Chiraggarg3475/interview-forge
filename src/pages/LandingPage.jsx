import React from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  const navigate = useNavigate();

  const handleIntervieweeClick = () => {
    navigate('/interviewee');
  };

  const handleInterviewerClick = () => {
    navigate('/login');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '24px'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 48,
        maxWidth: 800
      }}>
        <Title level={1} style={{ 
          fontSize: '3rem', 
          marginBottom: 16,
          background: 'linear-gradient(90deg, #0052D4 0%, #0066FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800
        }}>
          InterviewForge
        </Title>
        <Paragraph style={{ 
          fontSize: '1.2rem', 
          color: '#555',
          maxWidth: 600,
          margin: '0 auto'
        }}>
          AI-Powered Interview Simulator for Full-Stack Developers
        </Paragraph>
      </div>

      <Row gutter={[32, 32]} justify="center">
        <Col xs={24} sm={12} md={10} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              height: '100%',
              transition: 'all 0.3s ease'
            }}
            bodyStyle={{ 
              padding: 32, 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={handleIntervieweeClick}
          >
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0052D4 0%, #0066FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24
            }}>
              <UserOutlined style={{ 
                fontSize: 36, 
                color: 'white' 
              }} />
            </div>
            <Title level={3} style={{ 
              marginBottom: 16,
              color: '#333'
            }}>
              Interviewee
            </Title>
            <Paragraph style={{ 
              marginBottom: 24,
              color: '#666',
              fontSize: '1rem'
            }}>
              Take a simulated technical interview with AI-generated questions and real-time feedback.
            </Paragraph>
            <Button 
              type="primary" 
              size="large"
              style={{
                marginTop: 'auto',
                background: 'linear-gradient(135deg, #0052D4 0%, #0066FF 100%)',
                borderColor: '#0052D4'
              }}
            >
              Start Interview
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={10} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              height: '100%',
              transition: 'all 0.3s ease'
            }}
            bodyStyle={{ 
              padding: 32, 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={handleInterviewerClick}
          >
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24
            }}>
              <TeamOutlined style={{ 
                fontSize: 36, 
                color: 'white' 
              }} />
            </div>
            <Title level={3} style={{ 
              marginBottom: 16,
              color: '#333'
            }}>
              Interviewer Dashboard
            </Title>
            <Paragraph style={{ 
              marginBottom: 24,
              color: '#666',
              fontSize: '1rem'
            }}>
              Review candidate performance, analyze results, and manage interview sessions.
            </Paragraph>
            <Button 
              type="primary" 
              size="large"
              style={{
                marginTop: 'auto',
                background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
                borderColor: '#00b4d8'
              }}
            >
              View Dashboard
            </Button>
          </Card>
        </Col>
      </Row>

      <div style={{ 
        marginTop: 48, 
        textAlign: 'center',
        maxWidth: 600
      }}>
        <Paragraph style={{ 
          color: '#777',
          fontSize: '0.9rem'
        }}>
          <strong>Powered by Google Gemini AI</strong> - Get realistic technical interviews with intelligent question generation and answer evaluation.
        </Paragraph>
      </div>
    </div>
  );
};

export default LandingPage;