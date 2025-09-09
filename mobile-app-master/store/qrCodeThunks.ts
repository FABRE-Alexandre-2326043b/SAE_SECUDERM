import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { QRCode } from './types';
import { handleAxiosError } from './errors';

export const createQRCode = createAsyncThunk(
  'qrcode/addQRCode',
  async (newQRCode: { label: string; ref_product: string; dimension: string; lot_number: string; expiration_date: Date }, { rejectWithValue }) => {
    try {
      const response = await api.post('/qrcode', newQRCode);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const getQRCodesByClientId = createAsyncThunk(
  'qrcode/getQRCodesByClientId',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/qrcode/client/${clientId}`);
      const qrcodes: QRCode[] = response.data;
      return qrcodes;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const getQRCode = createAsyncThunk(
  'qrcode/getQRCode',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/qrcode/${id}`);
      const qrcode: QRCode = response.data;
      return qrcode;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const createShareQRCode = createAsyncThunk(
  'qrcode/createShareQRCode',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/share-qrcode`, { qrcode_id: id });
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const linkDoctorToQRCode = createAsyncThunk(
  'qrcode/linkDoctorToQRCode',
  async (verification_code: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/share-qrcode/add`, { verification_code });
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const getQRCodesByDoctorId = createAsyncThunk(
  'qrcode/getQRCodesByDoctorId',
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/qrcode/doctor/${doctorId}`);
      const qrcodes: QRCode[] = response.data;
      return qrcodes;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const linkTreatmentPlaceToQRCode = createAsyncThunk(
  'qrcode/linkTreatmentPlaceToQRCode',
  async (data: { qr_code_id: string, treatment_place_id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/qrcode/link/${data.qr_code_id}/${data.treatment_place_id}`);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);
