import { RootState } from "@/app/store/store";

export const selectCompaniesData = (state: RootState) =>
  state.companySlice.data;


export const selectCompaniesIsLoading = (state: RootState) =>
  state.companySlice.isLoading;
