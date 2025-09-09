import {createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "@/services/api";
import {handleAxiosError} from "@/store/errors";


export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: {id: string, first_name: string, last_name: string; email: string },
         { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${user.id}`, user);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);
