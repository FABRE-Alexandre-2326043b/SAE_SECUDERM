import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./store";
import {File} from "./types";
import {deleteFile, fetchFilesByTreatmentPlaceId, uploadFile} from "@/store/fileThunks";

export interface FileState {
  files: File[];
  uploadStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  uploadError: string | null;
  fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  fetchError: string | null;
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  deleteError: string | null;
}

const initialState: FileState = {
  files: [],
  uploadStatus: 'idle',
  uploadError: null,
  fetchStatus: 'idle',
  fetchError: null,
  deleteStatus: 'idle',
  deleteError: null,
};

export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    resetUploadStatus: (state) => {
      state.uploadStatus = 'idle';
    },
    resetFetchStatus: (state) => {
      state.fetchStatus = 'idle';
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.uploadStatus = 'loading';
        state.uploadError = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        state.files.push(action.payload);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.uploadError = action.payload as string;
      })
      .addCase(fetchFilesByTreatmentPlaceId.pending, (state) => {
        state.fetchStatus = 'loading';
        state.fetchError = null;
      })
      .addCase(fetchFilesByTreatmentPlaceId.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.files = action.payload;
      })
      .addCase(fetchFilesByTreatmentPlaceId.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.fetchError = action.payload as string;
      })
      .addCase(deleteFile.pending, (state) => {
        state.deleteStatus = 'loading';
        state.deleteError = null;
      })
      .addCase(deleteFile.fulfilled, (state, action: PayloadAction<string>) => {
        const fileId = action.payload;
        state.deleteStatus = 'succeeded';
        state.files = state.files.filter((file) => file.id !== fileId);
        state.deleteError = null;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload as string;
      });
  }
});

export const { resetUploadStatus, resetFetchStatus, resetDeleteStatus } = fileSlice.actions;

export const selectFiles = (state: RootState) => state.file.files;
export const selectUploadStatus = (state: RootState) => state.file.uploadStatus;
export const selectUploadError = (state: RootState) => state.file.uploadError;
export const selectFetchStatus = (state: RootState) => state.file.fetchStatus;
export const selectDeleteStatus = (state: RootState) => state.file.deleteStatus;
export const selectDeleteError = (state: RootState) => state.file.deleteError;
export default fileSlice.reducer;
