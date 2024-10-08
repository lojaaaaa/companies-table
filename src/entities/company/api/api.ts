import { API_COMPANIES, ErrorMessages, PER_PAGE } from "@/shared/config";
import { delay, getErrorMessage } from "@/shared/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import { clearStore, ICompany } from "../model";

type GetCompaniesParams = Record<string, string>;

export const createCompany = createAsyncThunk(
  'companies/createCompany',
  async function (params: Omit<ICompany, 'id'>, { rejectWithValue, dispatch }) {
    try {
      await delay(1000);
      const response = await fetch(`${API_COMPANIES}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...params,
          id: uuidv4()
        })
      });
      const data = await response.json();
      
      dispatch(clearStore())

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, ErrorMessages.CREATE_COMPANY_ERROR));
    }
  }
);

export const getCompanies = createAsyncThunk(
  'companies/getCompanies',
  async function (params: GetCompaniesParams, { rejectWithValue }) {
    try {
      const queryString = new URLSearchParams(params).toString();

      await delay(1000);
      const response = await fetch(`${API_COMPANIES}?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const items = await response.json();

      const totalCount = response.headers.get('X-Total-Count');
      const totalPages = totalCount ? Math.ceil(+totalCount / +PER_PAGE) : 1;

      return { items, totalPages };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, ErrorMessages.GET_COMPANIES_ERROR));
    }
  }
);

export const editCompany = createAsyncThunk(
  'companies/editCompanies',
  async function (params: { id: string, field: 'name' | 'address', value: string }, { rejectWithValue }) {
    try {

      await delay(1000);
      const response = await fetch(`${API_COMPANIES}/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: params.id,
          [params.field]: params.value,
        })
      });
      const data = await response.json();

      return data;

    } catch (error) {
      return rejectWithValue(getErrorMessage(error, ErrorMessages.EDIT_COMPANY_ERROR));
    }
  }
);

// Так как сервер не поддерживает возможность удаления сразу нескольких элементов,
// приходится выполнять запросы пакетами
export const deleteCompanies = createAsyncThunk(
  'companies/deleteCompanies',
  async function (idsToDelete: string[], { rejectWithValue }) {
    try {
      const batchSize = 50;
      const batches = [];

      for (let i = 0; i < idsToDelete.length; i += batchSize) {
        batches.push(idsToDelete.slice(i, i + batchSize));
      }
      
      await Promise.all(
        batches.map(async (batch) => {
          await Promise.all(
            batch.map(async (id) => {
              await fetch(`${API_COMPANIES}/${id}`, {
                method: 'DELETE',
              });
            })
          );
        })
      );

      return idsToDelete;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, ErrorMessages.DELETE_COMPANIES_ERROR));
    }
  }
);