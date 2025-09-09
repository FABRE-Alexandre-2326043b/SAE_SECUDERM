import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { User } from './types';
import {changePassword, login, me, register, resetPassword, sendPasswordEmail, verifyEmail} from './authThunks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearToken as clearApiToken } from '@/services/api';
import {updateUser} from "@/store/userThunks";

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  resetPasswordEmail: string;
  createAccountEmail: string;
  createAccountPassword: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  forgotPasswordEmailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  resetPasswordStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createAccountEmailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
  resetPasswordEmail: '',
  createAccountEmail: '',
  createAccountPassword: '',
  status: 'idle',
  forgotPasswordEmailStatus: 'idle',
  resetPasswordStatus: 'idle',
  createAccountEmailStatus: 'idle',
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.forgotPasswordEmailStatus = 'idle';
      state.resetPasswordStatus = 'idle';
      AsyncStorage.removeItem('authToken');
      clearApiToken();
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
      AsyncStorage.removeItem('authToken');
      clearApiToken();
    },
    setResetPasswordEmail: (state, action: PayloadAction<string>) => {
      state.resetPasswordEmail = action.payload
    },
    setCreateAccount: (state, action: PayloadAction<{ email: string; password: string }>) => {
      state.createAccountEmail = action.payload.email;
      state.createAccountPassword = action.payload.password;
    },
    clearResetPasswordEmail: (state) => {
      state.resetPasswordEmail = '';
      state.resetPasswordStatus = 'idle';
      state.forgotPasswordEmailStatus = 'idle';
    },
    clearCreateAccount: (state) => {
      state.createAccountEmail = '';
      state.createAccountPassword = '';
      state.createAccountEmailStatus = 'idle';
    },
    clearCreateAccountEmailStatus: (state) => {
      state.createAccountEmailStatus = 'idle';
    },
    resetAuthStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.createAccountEmailStatus = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.createAccountEmailStatus = 'succeeded';
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.createAccountEmailStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.createAccountEmailStatus = 'loading';
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.createAccountEmailStatus = 'succeeded';
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.createAccountEmailStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<any>) => {
        if (state.user?.id != null && state.user.id === action.payload.id) {
          state.user = action.payload;
          state.status = 'succeeded';
          state.error = null;
        }
      })
      .addCase(sendPasswordEmail.pending, (state) => {
        state.forgotPasswordEmailStatus = 'loading';
        state.error = null;
      })
      .addCase(sendPasswordEmail.fulfilled, (state) => {
        state.forgotPasswordEmailStatus = 'succeeded';
        state.error = null;
      })
      .addCase(sendPasswordEmail.rejected, (state, action) => {
        state.forgotPasswordEmailStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordStatus = 'loading';
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordStatus = 'succeeded';
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(me.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(me.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(me.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
    },
});

export const { resetAuthStatus, logout, setToken, clearToken, setResetPasswordEmail, clearResetPasswordEmail, setCreateAccount, clearCreateAccount, clearCreateAccountEmailStatus } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUserAuth = (state: RootState) => state.auth.user;
export const selectStatus = (state: RootState) => state.auth.status;
export const selectError = (state: RootState) => state.auth.error;
export const selectForgotPasswordEmailStatus = (state: RootState) => state.auth.forgotPasswordEmailStatus;
export const selectResetPasswordStatus = (state: RootState) => state.auth.resetPasswordStatus;
export const selectResetPasswordEmail = (state: RootState) => state.auth.resetPasswordEmail;
export const selectCreateAccountEmailStatus = (state: RootState) => state.auth.createAccountEmailStatus;
export const selectCreateAccountEmail = (state: RootState) => state.auth.createAccountEmail;
export const selectCreateAccountPassword = (state: RootState) => state.auth.createAccountPassword;


export default authSlice.reducer;
