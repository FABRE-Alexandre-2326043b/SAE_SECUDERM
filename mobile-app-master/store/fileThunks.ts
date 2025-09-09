import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { handleAxiosError } from './errors';

export const uploadFile = createAsyncThunk(
  'file/uploadFile',
  async (
    { file, treatmentPlaceId }: { file: string; treatmentPlaceId: string },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      formData.append('file', {
        uri: file,
        name: file.split('/').pop() || 'uploaded_file',
        type: 'application/octet-stream',
      } as any);

      formData.append('treatment_place_id', treatmentPlaceId);

      const response = await api.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.file;
    } catch (err) {
      console.error(err);
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const fetchFilesByTreatmentPlaceId = createAsyncThunk(
  'file/fetchFilesByTreatmentPlaceId',
  async (treatmentPlaceId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/file/urls/${treatmentPlaceId}`);
      console.log(response.data);
      return response.data.files;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const deleteFile = createAsyncThunk(
  'file-notes/deleteFile',
  async (file_id: string, {rejectWithValue}) => {
    try {
      await api.delete(`/file/${file_id}`);
      return file_id;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);