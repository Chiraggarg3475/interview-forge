import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message, Card, Descriptions } from 'antd';
import ResumeUpload from '../components/ResumeUpload';
import ChatInterface from '../components/ChatInterface';
import Timer from '../components/Timer';
import WelcomeModal from '../components/WelcomeModal';
import CandidateInfoForm from '../components/CandidateInfoForm';
import { updateCandidate, addChatMessage, completeInterview } from '../redux/slices/candidatesSlice';
import { startSession, nextQuestion, endSession } from '../redux/slices/sessionSlice';
import { generateQuestions, judgeAnswer, generateSummary } from '../services/aiService';
import { getTimeForDifficulty } from '../utils/helpers';

const IntervieweePage = () => {
  const dispatch = useDispatch();
  const currentCandidate = useSelector((state) => state.candidates.currentCandidate);
  const session = useSelector((state) => state.session);
  
  const [chatMessages, setChatMessages] = useState([]);
  const [pendingField, setPendingField] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [interviewPhase, setInterviewPhase] = useState('upload'); // 'upload' | 'info' | 'active' | 'complete'
  const [showCandidateForm, setShowCandidateForm] = useState(false);

  // Check for in-progress interview on mount
  useEffect(() => {
    if (currentCandidate?.status === 'in_progress' && session.currentCandidateId) {
      setShowWelcomeModal(true);
      setInterviewPhase('active');
    }
  }, []);

  useEffect(() => {
  if (currentCandidate?.status === 'pending' && interviewPhase === 'info') {
    // Always show the form regardless of whether information is missing or not
    setShowCandidateForm(true);
  } else if (currentCandidate && interviewPhase === 'info' && currentCandidate.status !== 'pending') {
    // If candidate exists and info phase but not pending, still show form for confirmation
    setShowCandidateForm(true);
  }
}, [currentCandidate, interviewPhase]);

  const addBotMessage = (text) => {
    setChatMessages((prev) => [...prev, { type: 'bot', text, timestamp: Date.now() }]);
  };

  const addUserMessage = (text) => {
    setChatMessages((prev) => [...prev, { type: 'user', text, timestamp: Date.now() }]);
  };

  const handleUploadSuccess = (candidate) => {
    setChatMessages([]);
    setInterviewPhase('info');
    
    addBotMessage('Hello! I\'ve received your resume. Let me review the information...');
    
    setTimeout(() => {
      // Display extracted information
      addBotMessage(`Found the following details:\n\n` +
        `Name: ${candidate.name || 'Not found'}\n` +
        `Email: ${candidate.email || 'Not found'}\n` +
        `Phone: ${candidate.phone || 'Not found'}`);
      
      // Always show form for confirmation, even if all info is found
      setTimeout(() => {
        addBotMessage('Please confirm your information in the form below before we begin.');
      }, 1000);
    }, 1000);
  };

  const handlePendingFieldInput = async (value) => {
    if (!pendingField || !currentCandidate) return;

    const updates = { [pendingField]: value };
    dispatch(updateCandidate({ id: currentCandidate.id, ...updates }));

    const updatedCandidate = { ...currentCandidate, ...updates };
    
    // Check remaining missing fields
    const missing = [];
    if (!updatedCandidate.name) missing.push('name');
    if (!updatedCandidate.email) missing.push('email');
    if (!updatedCandidate.phone) missing.push('phone');
    
    if (missing.length > 0) {
      setPendingField(missing[0]);
      addBotMessage(`Thank you! Now, please provide your ${missing[0]}:`);
    } else {
      setPendingField(null);
      dispatch(updateCandidate({ id: currentCandidate.id, status: 'in_progress' }));
      addBotMessage('Perfect! All information collected. Starting your interview now...');
      setTimeout(() => startInterview(updatedCandidate), 1500);
    }
  };

  const handleFormSubmit = (values) => {
    console.log("HERE1");
    if (!currentCandidate) {
      console.log("HERE");
      return;
    }
    
    const updates = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      status: 'in_progress'
    };
    
    dispatch(updateCandidate({ id: currentCandidate.id, ...updates }));
    console.log("HERE2");
    setInterviewPhase('active');
    setShowCandidateForm(false);
    
    addBotMessage('Perfect! All information collected. Starting your interview now...');
    setTimeout(() => startInterview({ ...currentCandidate, ...updates }), 1500);
  };

  const startInterview = async (candidate) => {
    setIsProcessing(true);
    setInterviewPhase('active');
    addBotMessage('Generating interview questions...');

    try {
      const questions = await generateQuestions();
      const initialTime = getTimeForDifficulty(questions[0].difficulty);
      
      dispatch(startSession({
        candidateId: candidate.id,
        questions,
        initialTime
      }));

      setTimeout(() => {
        addBotMessage(`Question 1 of 6: ${questions[0].question}`);
        setIsProcessing(false);
      }, 1000);
    } catch (error) {
      message.error('Failed to generate questions');
      setIsProcessing(false);
    }
  };

  const handleAnswer = async (answer) => {
    if (pendingField) {
      addUserMessage(answer);
      handlePendingFieldInput(answer);
      return;
    }

    if (!session.questions || session.currentQuestionIndex >= session.questions.length) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    addUserMessage(answer);
    setIsProcessing(true);

    try {
      // Check if answer is empty or just timeout
      const judgment = await judgeAnswer(currentQuestion.question, answer);
      
      const chatEntry = {
        question: currentQuestion.question,
        answer: answer || '[No answer provided]',
        difficulty: currentQuestion.difficulty,
        score: judgment.score,
        timeTaken: getTimeForDifficulty(currentQuestion.difficulty) - session.remainingTime
      };

      dispatch(addChatMessage({
        candidateId: currentCandidate.id,
        message: chatEntry
      }));

      // Don't show score during interview - just move to next question
      if (session.currentQuestionIndex < session.questions.length - 1) {
        dispatch(nextQuestion());
        setTimeout(() => {
          const nextQ = session.questions[session.currentQuestionIndex + 1];
          addBotMessage(`Question ${session.currentQuestionIndex + 2} of 6: ${nextQ.question}`);
          setIsProcessing(false);
        }, 800);
      } else {
        // Last question answered
        finishInterview();
      }
    } catch (error) {
      message.error('Failed to process answer');
      setIsProcessing(false);
    }
  };

  const handleTimeout = () => {
    handleAnswer(''); // Submit empty answer on timeout
  };

  const finishInterview = async () => {
    setInterviewPhase('complete');
    addBotMessage('Interview complete! Calculating your results...');
    setIsProcessing(true);

    try {
      // Get updated candidate from store
      const candidates = useSelector.getState?.()?.candidates?.candidates || [];
      const candidate = candidates.find(c => c.id === currentCandidate.id) || currentCandidate;
      
      const summary = await generateSummary(candidate.chatHistory);

      dispatch(completeInterview({
        candidateId: currentCandidate.id,
        score: summary.totalScore,
        summary: summary.summary
      }));

      // Now show results
      setTimeout(() => {
        addBotMessage('📊 Interview Results:');
        addBotMessage(`Final Score: ${summary.totalScore}/100`);
        addBotMessage('');
        addBotMessage('Performance Summary:');
        addBotMessage(summary.summary);
        addBotMessage('');
        addBotMessage('Question-by-Question Breakdown:');
        
        candidate.chatHistory.forEach((entry, index) => {
          addBotMessage(`\nQ${index + 1} (${entry.difficulty}): ${entry.score}/10 - ${entry.question}`);
        });

        addBotMessage('');
        addBotMessage('Thank you for completing the interview! Check the Interviewer Dashboard to see detailed results.');
      }, 1500);

      dispatch(endSession());
      setIsProcessing(false);
    } catch (error) {
      message.error('Failed to generate summary');
      setIsProcessing(false);
    }
  };

  const handleResumeInterview = () => {
    setShowWelcomeModal(false);
    setInterviewPhase('active');
    const messages = [];
    
    currentCandidate.chatHistory.forEach((entry, index) => {
      messages.push({ 
        type: 'bot', 
        text: `Question ${index + 1}: ${entry.question}`, 
        timestamp: Date.now() - (100 * index) 
      });
      messages.push({ 
        type: 'user', 
        text: entry.answer, 
        timestamp: Date.now() - (99 * index) 
      });
    });

    const nextQuestionIndex = session.currentQuestionIndex;
    if (nextQuestionIndex < session.questions.length) {
      messages.push({ 
        type: 'bot', 
        text: `Question ${nextQuestionIndex + 1} of 6: ${session.questions[nextQuestionIndex].question}`, 
        timestamp: Date.now() 
      });
    }

    setChatMessages(messages);
  };

  if (!currentCandidate && interviewPhase === 'upload') {
    return <ResumeUpload onUploadSuccess={handleUploadSuccess} />;
  }

  const isInterviewActive = session.currentCandidateId === currentCandidate?.id && 
                           session.questions.length > 0 && 
                           session.currentQuestionIndex < session.questions.length &&
                           interviewPhase === 'active';

  return (
    <>
      <WelcomeModal
        visible={showWelcomeModal}
        onResume={handleResumeInterview}
        candidateName={currentCandidate?.name}
        questionNumber={session.currentQuestionIndex + 1}
      />

      {/* Display candidate info card during info collection phase */}
      {showCandidateForm && currentCandidate && (
        <CandidateInfoForm
          candidate={currentCandidate}
          onSubmit={handleFormSubmit}
        />
      )}

      {isInterviewActive && (
        <Timer
          initialTime={session.remainingTime}
          onTimeout={handleTimeout}
          isPaused={isProcessing}
          difficulty={session.questions[session.currentQuestionIndex].difficulty}
        />
      )}

    {/* Only show chat when not showing form */}
      {!showCandidateForm && (
        <ChatInterface
          messages={chatMessages}
          onSendMessage={handleAnswer}
          disabled={isProcessing || interviewPhase === 'complete'}
        />
      )}
    </>
  );
};

export default IntervieweePage;
