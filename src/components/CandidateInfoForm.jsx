import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CandidateInfoForm = ({ candidate, onSubmit }) => {
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate email format
  const validateEmail = (_, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || emailRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Please enter a valid email address'));
  };

  // Validate phone format
  const validatePhone = (_, value) => {
    const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    if (!value || phoneRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Please enter a valid phone number'));
  };

  // Check if all fields are filled
  const checkFormValidity = () => {
    const values = form.getFieldsValue();
    const isValid = values.name && values.email && values.phone &&
                   values.name.trim() !== '' && 
                   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) &&
                   /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(values.phone);
    setIsFormValid(isValid);
  };

  // Initialize form with existing data
  useEffect(() => {
    if (candidate) {
      form.setFieldsValue({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || ''
      });
      checkFormValidity();
    }
  }, [candidate]);

  const onFinish = (values) => {
    console.log("HERE");
    onSubmit(values);
  };

  return (
    <Card style={{ maxWidth: 500, margin: '24px auto' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
        Confirm Your Information
      </Title>
      <p style={{ textAlign: 'center', marginBottom: 24 }}>
        Please review and confirm your information before starting the interview.
      </p>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={checkFormValidity}
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[
            { 
              required: true, 
              message: 'Please enter your full name' 
            },
            { 
              min: 2, 
              message: 'Name must be at least 2 characters' 
            }
          ]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Enter your full name" 
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { 
              required: true, 
              message: 'Please enter your email address' 
            },
            { 
              validator: validateEmail 
            }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Enter your email address" 
            type="email"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { 
              required: true, 
              message: 'Please enter your phone number' 
            },
            { 
              validator: validatePhone 
            }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined />} 
            placeholder="Enter your phone number" 
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            disabled={!isFormValid}
          >
            Start Interview
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CandidateInfoForm;