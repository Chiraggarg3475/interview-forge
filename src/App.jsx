import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import IntervieweePage from './pages/IntervieweePage';
import InterviewerPage from './pages/InterviewerPage';
import { Tabs } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import './App.css';
import LoginPage from './pages/Login';

const InterviewLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    {
      key: 'interviewee',
      children: <IntervieweePage />
    },
    {
      key: 'interviewer',
      children: <InterviewerPage />
    }
  ];

  const activeKey = location.pathname === '/interviewer' ? 'interviewer' : 'interviewee';

  return (
    <div className="app-container">
      <header className="app-header">
        <h1><a style={{ textDecoration: 'none', color: "white" }} href="/">InterviewForge</a></h1>
        <p>AI-Powered Interview Simulator for Full-Stack Developers</p>
      </header>
      <Tabs 
        activeKey={activeKey}
        items={items}
        size="large"
        centered
        className="main-tabs"
        onChange={(key) => {
          navigate(key === 'interviewer' ? '/interviewer' : '/interviewee');
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/interviewee" element={<InterviewLayout />} />
        <Route path="/interviewer" element={<InterviewLayout />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;