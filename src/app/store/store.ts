import { companySlice } from '@/entities/company';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    [companySlice.name]: companySlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;