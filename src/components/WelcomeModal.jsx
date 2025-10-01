import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Title, Paragraph } = Typography;

const WelcomeModal = ({ visible, onResume, candidateName, questionNumber }) => {
  return (
    <Modal
      title={<Title level={3}>Welcome Back!</Title>}
      open={visible}
      onCancel={null}
      footer={null}
      closable={false}
      centered
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <ClockCircleOutlined style={{ fontSize: 48, color: '#0052D4', marginBottom: 16 }} />
        <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
          Hi {candidateName || 'Candidate'}, you have an interview in progress.
        </Paragraph>
        <Paragraph type="secondary">
          You were on question {questionNumber} of 6. Would you like to continue where you left off?
        </Paragraph>
        <Button
          type="primary"
          size="large"
          onClick={onResume}
          style={{ marginTop: 16, width: 200 }}
        >
          Resume Interview
        </Button>
      </div>
    </Modal>
  );
};

WelcomeModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onResume: PropTypes.func.isRequired,
  candidateName: PropTypes.string,
  questionNumber: PropTypes.number
};

WelcomeModal.defaultProps = {
  candidateName: 'Candidate',
  questionNumber: 1
};

export default WelcomeModal;
