import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  candidates: [],
  currentCandidate: null
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action) => {
      state.candidates.push(action.payload);
      state.currentCandidate = action.payload;
    },
    updateCandidate: (state, action) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = { ...state.candidates[index], ...action.payload };
        if (state.currentCandidate?.id === action.payload.id) {
          state.currentCandidate = state.candidates[index];
        }
      }
    },
    addChatMessage: (state, action) => {
      const { candidateId, message } = action.payload;
      const candidate = state.candidates.find(c => c.id === candidateId);
      if (candidate) {
        candidate.chatHistory.push(message);
      }
    },
    completeInterview: (state, action) => {
      const { candidateId, score, summary } = action.payload;
      const candidate = state.candidates.find(c => c.id === candidateId);
      if (candidate) {
        candidate.status = 'completed';
        candidate.score = score;
        candidate.summary = summary;
      }
    },
    setCurrentCandidate: (state, action) => {
      state.currentCandidate = action.payload;
    }
  }
});

export const {
  addCandidate,
  updateCandidate,
  addChatMessage,
  completeInterview,
  setCurrentCandidate
} = candidatesSlice.actions;

export default candidatesSlice.reducer;
