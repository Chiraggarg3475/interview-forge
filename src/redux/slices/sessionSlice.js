import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentCandidateId: null,
  currentQuestionIndex: 0,
  remainingTime: 0,
  isPaused: false,
  questions: [],
  startTime: null
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession: (state, action) => {
      state.currentCandidateId = action.payload.candidateId;
      state.questions = action.payload.questions;
      state.currentQuestionIndex = 0;
      state.remainingTime = action.payload.initialTime;
      state.isPaused = false;
      state.startTime = Date.now();
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
        const nextQuestion = state.questions[state.currentQuestionIndex];
        state.remainingTime = getTimeForDifficulty(nextQuestion.difficulty);
      }
    },
    updateTimer: (state, action) => {
      state.remainingTime = action.payload;
    },
    pauseSession: (state) => {
      state.isPaused = true;
    },
    resumeSession: (state) => {
      state.isPaused = false;
    },
    endSession: (state) => {
      return initialState;
    }
  }
});

const getTimeForDifficulty = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return 20;
    case 'medium':
      return 60;
    case 'hard':
      return 120;
    default:
      return 60;
  }
};

export const {
  startSession,
  nextQuestion,
  updateTimer,
  pauseSession,
  resumeSession,
  endSession
} = sessionSlice.actions;

export default sessionSlice.reducer;
