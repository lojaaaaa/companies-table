import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyState, ICompany } from './types';
import { deleteCompanies, getCompanies } from '../api';
import { editCompany } from '@/entities/company/api';

const initialState: CompanyState = {
  data: {
    items: [],
    totalPages: 0
  },
  isLoading: false,
};

export const companySlice = createSlice({
  name: 'companySlice',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getCompanies.fulfilled, (state, action: PayloadAction<{ items: ICompany[], totalPages: number}>) => {
        const { items, totalPages } = action.payload;
        state.data = {
          items: [...state.data.items, ...items],
          totalPages
        };
        state.isLoading = false;
      })

      .addCase(editCompany.fulfilled, ({ data }, { payload }: PayloadAction<ICompany>) => {
        data.items = data.items.map(item => item.id === payload.id ? payload : item)
      })

      .addCase(deleteCompanies.fulfilled, (state, { payload }: PayloadAction<string[]>) => {
        state.data.items = state.data.items.filter(item => !payload.includes(item.id));
      })
  },
  reducers: {
    clearStore(state) {
      state.data.items = [];
    }
  },
});

export const { clearStore } = companySlice.actions;