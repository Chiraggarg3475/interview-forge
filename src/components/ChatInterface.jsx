import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import moment from 'moment';

const { TextArea } = Input;

const ChatInterface = ({ messages, onSendMessage, disabled }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.type}`}>
            <div className={`message-bubble ${msg.type}`}>
              <div>{msg.text}</div>
              {msg.timestamp && (
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
                  {moment(msg.timestamp).format('HH:mm:ss')}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your answer here..."
          autoSize={{ minRows: 2, maxRows: 4 }}
          disabled={disabled}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          size="large"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

ChatInterface.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['bot', 'user']).isRequired,
      text: PropTypes.string.isRequired,
      timestamp: PropTypes.number
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

ChatInterface.defaultProps = {
  disabled: false
};

export default ChatInterface;
