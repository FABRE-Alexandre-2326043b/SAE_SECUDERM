import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { User } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken } from '@/services/api';
import { handleAxiosError } from "@/store/errors";

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user }: { token: string; user: User } = response.data;
      await AsyncStorage.setItem('authToken', token);
      setToken(token);
      return { token, user };
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (newUser: { email: string; password: string; first_name: string; last_name: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', newUser);
      const { token, user }: { token: string; user: User } = response.data;
      return { token, user };
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (info : {password: string, email: string, code: string}, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/reset-password', info);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const sendPasswordEmail = createAsyncThunk(
  'auth/sendPasswordEmail',
  async (info : {email:string, emailType:string}, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/send-password-email', info);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (info : {oldPassword: string, newPassword: string, code: string}, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/change-password', info);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (data : {email: string, password: string, code: string}, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-email', data);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const me = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/me');
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);



