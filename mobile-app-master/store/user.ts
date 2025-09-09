import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getUserById, updateUser} from "@/store/userThunks";
import {RootState} from "@/store/store";


export interface userState {
  user: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: userState = {
  user: [],
  status: 'idle',
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<any>) => {
        state.user.push(action.payload);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<any>) => {
        const updatedUser = action.payload;
        const index = state.user.findIndex((user) => user.id === updatedUser.id);
        if (index !== -1) {
          state.user[index] = updatedUser;
        }
        else {
          state.user.push(updatedUser);
        }
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export const {clearUserError} = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;