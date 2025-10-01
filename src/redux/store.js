import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import localforage from 'localforage';
import candidatesReducer from './slices/candidatesSlice';
import sessionReducer from './slices/sessionSlice';

// Configure localforage
localforage.config({
  name: 'InterviewForge',
  storeName: 'interview_data',
  description: 'Interview data storage'
});

const persistConfig = {
  key: 'root',
  storage: localforage,
  whitelist: ['candidates', 'session']
};

const rootReducer = {
  candidates: candidatesReducer,
  session: sessionReducer
};

// Apply persistence to each reducer
const persistedCandidatesReducer = persistReducer(
  { ...persistConfig, key: 'candidates' },
  candidatesReducer
);

const persistedSessionReducer = persistReducer(
  { ...persistConfig, key: 'session' },
  sessionReducer
);

export const store = configureStore({
  reducer: {
    candidates: persistedCandidatesReducer,
    session: persistedSessionReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }),
  devTools: import.meta.env.DEV
});

export const persistor = persistStore(store);
