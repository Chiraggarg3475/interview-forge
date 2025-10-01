import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Input, Modal, List, Tag, Typography, Space, Empty } from 'antd';
import { SearchOutlined, TrophyOutlined } from '@ant-design/icons';
import { getScoreClass } from '../utils/helpers';
import moment from 'moment';

const { Title, Paragraph, Text } = Typography;

const InterviewerPage = () => {
  const candidates = useSelector((state) => state.candidates.candidates);
  const [searchText, setSearchText] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  });

  const filteredCandidates = candidates.filter((candidate) => {
    const search = searchText.toLowerCase();
    return (
      candidate.name?.toLowerCase().includes(search) ||
      candidate.email?.toLowerCase().includes(search)
    );
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
      render: (text) => text || 'N/A'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || 'N/A'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'In Progress', value: 'in_progress' },
        { text: 'Completed', value: 'completed' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const colorMap = {
          pending: 'orange',
          in_progress: 'blue',
          completed: 'green'
        };
        return <Tag color={colorMap[status]}>{status.replace('_', ' ').toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => a.score - b.score,
      defaultSortOrder: 'descend',
      render: (score) => (
        <span className={`score-badge ${getScoreClass(score)}`}>
          {score}/100
        </span>
      )
    }
  ];

  const handleRowClick = (record) => {
    setSelectedCandidate(record);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedCandidate(null), 300);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

    return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Title level={2}>
          <TrophyOutlined /> Candidate Dashboard
        </Title>
        <Input
          placeholder="Search by name or email..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 400, marginBottom: 16 }}
          size="large"
        />
      </div>

      {filteredCandidates.length === 0 ? (
        <Empty
          description="No candidates found"
          style={{ marginTop: 48 }}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredCandidates}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => handleRowClick(record)
          })}
          pagination={{
            ...pagination,
            total: filteredCandidates.length,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} candidates`,
            pageSizeOptions: ['5', '10', '20', '50'],
          }}
          onChange={handleTableChange}
        />
      )}

      <Modal
        title={<Title level={3}>Candidate Details</Title>}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        {selectedCandidate && (
          <div>
            <div className="profile-section">
              <Title level={4}>Profile Information</Title>
              <div className="profile-item">
                <strong>Name:</strong> {selectedCandidate.name || 'N/A'}
              </div>
              <div className="profile-item">
                <strong>Email:</strong> {selectedCandidate.email || 'N/A'}
              </div>
              <div className="profile-item">
                <strong>Phone:</strong> {selectedCandidate.phone || 'N/A'}
              </div>
              <div className="profile-item">
                <strong>Status:</strong>{' '}
                <Tag color={
                  selectedCandidate.status === 'completed' ? 'green' :
                  selectedCandidate.status === 'in_progress' ? 'blue' : 'orange'
                }>
                  {selectedCandidate.status.replace('_', ' ').toUpperCase()}
                </Tag>
              </div>
            </div>

            {selectedCandidate.chatHistory.length > 0 && (
              <div className="chat-history-section">
                <Title level={4}>Interview Responses</Title>
                <List
                  dataSource={selectedCandidate.chatHistory}
                  renderItem={(item, index) => (
                    <div className="question-item" key={index}>
                      <div className="question-header">
                        <Text strong>Question {index + 1}</Text>
                        <Tag className={`difficulty-tag difficulty-${item.difficulty}`}>
                          {item.difficulty}
                        </Tag>
                      </div>
                      <Paragraph>
                        <strong>Q:</strong> {item.question}
                      </Paragraph>
                      <Paragraph>
                        <strong>A:</strong> {item.answer || 'No answer provided'}
                      </Paragraph>
                      <Space>
                        <Text type="secondary">
                          Score: <span className={getScoreClass(item.score * 10)}>{item.score}/10</span>
                        </Text>
                        <Text type="secondary">
                          Time: {item.timeTaken}s
                        </Text>
                      </Space>
                    </div>
                  )}
                />
              </div>
            )}

            {selectedCandidate.status === 'completed' && (
              <div className="summary-section">
                <Title level={4}>Performance Summary</Title>
                <div style={{ marginBottom: 12 }}>
                  <Text strong style={{ fontSize: 20 }}>
                    Final Score:{' '}
                    <span className={getScoreClass(selectedCandidate.score)}>
                      {selectedCandidate.score}/100
                    </span>
                  </Text>
                </div>
                <Paragraph>{selectedCandidate.summary}</Paragraph>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InterviewerPage;
