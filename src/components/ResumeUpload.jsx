import React from 'react';
import { Upload, Button, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addCandidate } from '../redux/slices/candidatesSlice';
import { parsePDF, parseDOCX, extractCandidateInfo } from '../services/resumeService';
import { isValidFileType } from '../utils/helpers';
import PropTypes from 'prop-types';

const { Dragger } = Upload;

const ResumeUpload = ({ onUploadSuccess }) => {
  const dispatch = useDispatch();

  const handleUpload = async (file) => {
    if (!isValidFileType(file)) {
      message.error('Invalid file format. Please upload PDF or DOCX file.');
      return false;
    }

    try {
      message.loading('Processing resume...', 0);
      
      let resumeText = '';
      
      if (file.type === 'application/pdf') {
        resumeText = await parsePDF(file);
      } else {
        resumeText = await parseDOCX(file);
      }

      const candidateInfo = extractCandidateInfo(resumeText);
      
      const candidate = {
        id: uuidv4(),
        name: candidateInfo.name,
        email: candidateInfo.email,
        phone: candidateInfo.phone,
        resumeData: candidateInfo.resumeData,
        status: candidateInfo.name && candidateInfo.email && candidateInfo.phone ? 'in_progress' : 'pending',
        score: 0,
        summary: '',
        chatHistory: []
      };

      dispatch(addCandidate(candidate));
      message.destroy();
      message.success('Resume uploaded successfully!');
      onUploadSuccess(candidate);
      
    } catch (error) {
      message.destroy();
      message.error('Failed to process resume. Please try again.');
      console.error('Resume upload error:', error);
    }

    return false;
  };

  return (
    <div className="upload-section">
      <h2>Upload Your Resume</h2>
      <p style={{ marginBottom: 24, color: '#666' }}>
        Upload your resume in PDF or DOCX format to begin the interview process
      </p>
      <Dragger
        name="resume"
        accept=".pdf,.docx"
        beforeUpload={handleUpload}
        showUploadList={false}
        multiple={false}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ color: '#0052D4' }} />
        </p>
        <p className="ant-upload-text">Click or drag file to upload</p>
        <p className="ant-upload-hint">
          Supported formats: PDF, DOCX
        </p>
      </Dragger>
      <Button 
        type="link" 
        style={{ marginTop: 16 }}
        onClick={() => {
          message.info('Your resume data is stored locally and never sent to external servers except for AI processing.');
        }}
      >
        Privacy & Data Security
      </Button>
    </div>
  );
};

ResumeUpload.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired
};

export default ResumeUpload;
