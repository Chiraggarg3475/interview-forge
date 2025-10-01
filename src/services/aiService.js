import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const USE_MOCK = !API_KEY || API_KEY === 'your_gemini_api_key_here';

let genAI = null;
let model = null;

if (!USE_MOCK) {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  } catch (error) {
    console.error('Failed to initialize Gemini AI:', error);
  }
}

/**
 * Generate interview questions using Gemini API
 * @returns {Promise<Array>} Array of question objects
 */
export async function generateQuestions() {
  if (USE_MOCK || !model) {
    console.warn('Using mock questions - Gemini API not configured');
    return getMockQuestions();
  }

  try {
    const prompt = `Generate a JSON array of exactly 6 interview questions for a React/Node.js full-stack developer role. 
    Return ONLY valid JSON with this exact structure: 
    [{"question": "string", "difficulty": "easy"|"medium"|"hard"}]
    
    Requirements:
    - 2 questions with difficulty "easy" (React basics, JSX, components)
    - 2 questions with difficulty "medium" (Hooks, state management, API integration)
    - 2 questions with difficulty "hard" (Performance optimization, architecture, scalability)
    
    Examples:
    Easy: "What is JSX in React?", "Explain the difference between props and state"
    Medium: "How do React hooks differ from class lifecycle methods?", "Explain Redux state management"
    Hard: "How would you optimize a React app with large datasets?", "Explain Node.js clustering for API scalability"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response');
    }

    const questions = JSON.parse(jsonMatch[0]);
    
    // Validate structure
    if (!Array.isArray(questions) || questions.length !== 6) {
      throw new Error('Invalid questions format');
    }

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    return getMockQuestions();
  }
}

/**
 * Judge an answer using Gemini API
 * @param {string} question - The interview question
 * @param {string} answer - The candidate's answer
 * @returns {Promise<Object>} Score and feedback
 */
export async function judgeAnswer(question, answer) {
  // **FIX: Check for empty answer immediately**
  if (!answer || !answer.trim()) {
    return {
      score: 0,
      feedback: 'No answer provided - time expired or empty submission.'
    };
  }

  if (USE_MOCK || !model) {
    return getMockJudgment();
  }

  try {
    const prompt = `Score this interview answer from 0-10 for technical accuracy and relevance.
    Return ONLY valid JSON: {"score": number, "feedback": "string"}
    
    Question: ${question}
    Answer: ${answer}
    
    Scoring criteria:
    0-3: Incorrect or irrelevant
    4-6: Partially correct
    7-8: Mostly correct
    9-10: Excellent and comprehensive
    
    Provide 1-sentence feedback.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response');
    }

    const judgment = JSON.parse(jsonMatch[0]);
    
    return {
      score: Math.min(10, Math.max(0, Number(judgment.score) || 0)),
      feedback: judgment.feedback || 'Answer evaluated'
    };
  } catch (error) {
    console.error('Error judging answer:', error);
    return getMockJudgment();
  }
}

/**
 * Generate interview summary using Gemini API
 * @param {Array} chatHistory - Array of Q&A with scores
 * @returns {Promise<Object>} Total score and summary
 */
export async function generateSummary(chatHistory) {
  if (USE_MOCK || !model) {
    return getMockSummary(chatHistory);
  }

  try {
    const avgScore = chatHistory.reduce((sum, item) => sum + item.score, 0) / chatHistory.length;
    const totalScore = Math.round(avgScore * 10);

    const prompt = `Analyze this interview performance and provide a 2-3 sentence summary.
    Return ONLY valid JSON: {"totalScore": number, "summary": "string"}
    
    Chat History: ${JSON.stringify(chatHistory)}
    
    Total Score (0-100): ${totalScore}
    
    Provide constructive feedback on strengths and areas for improvement.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response');
    }

    const summary = JSON.parse(jsonMatch[0]);
    
    return {
      totalScore: Math.min(100, Math.max(0, Number(summary.totalScore) || totalScore)),
      summary: summary.summary || 'Interview completed.'
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    return getMockSummary(chatHistory);
  }
}

// Mock data functions
function getMockQuestions() {
  return [
    { question: "What is JSX and why is it used in React?", difficulty: "easy" },
    { question: "Explain the difference between useState and useEffect hooks", difficulty: "easy" },
    { question: "How does Redux manage application state?", difficulty: "medium" },
    { question: "What is the purpose of useEffect cleanup functions?", difficulty: "medium" },
    { question: "How would you implement caching in a Node.js API?", difficulty: "hard" },
    { question: "Explain CORS and how to configure it in Express", difficulty: "hard" }
  ];
}

function getMockJudgment() {
  return {
    score: Math.floor(Math.random() * 4) + 6,
    feedback: "Good understanding demonstrated with room for more detail."
  };
}

function getMockSummary(chatHistory) {
  const avgScore = chatHistory.reduce((sum, item) => sum + item.score, 0) / chatHistory.length;
  const totalScore = Math.round(avgScore * 10);
  
  return {
    totalScore,
    summary: `Candidate showed ${totalScore >= 70 ? 'strong' : 'moderate'} technical knowledge with ${totalScore >= 80 ? 'excellent' : 'good'} understanding of React concepts. ${totalScore < 70 ? 'Additional focus on Node.js backend concepts recommended.' : 'Well-prepared for full-stack roles.'}`
  };
}
