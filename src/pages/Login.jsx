import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    
    // Simple demo authentication - no API call
    // Default credentials: username: admin, password: admin
    setTimeout(() => {
      if (values.username === 'admin' && values.password === 'admin') {
        // Store login status in localStorage
        localStorage.setItem('interviewerLoggedIn', 'true');
        message.success('Login successful!');
        navigate('/interviewer');
      } else {
        message.error('Invalid credentials. Use admin / admin for demo.');
      }
      setLoading(false);
    }, 500); // Shorter delay for demo
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '24px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 450,
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
        }}
        bodyStyle={{ padding: 40 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <LockOutlined style={{ fontSize: 32, color: 'white' }} />
          </div>
          <Title level={2} style={{ marginBottom: 8 }}>Interviewer Login</Title>
          <Text type="secondary">Access the Interviewer Dashboard</Text>
        </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Enter your username" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              style={{
                background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
                borderColor: '#00b4d8'
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Text type="secondary">Demo credentials: admin / admin</Text>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button type="link" onClick={handleBackToLanding}>
            Back to Landing Page
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;