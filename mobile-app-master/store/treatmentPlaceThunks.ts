import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import {TreatmentPlace} from './types';
import { handleAxiosError } from './errors';

export const fetchTreatmentPlacesByClientId = createAsyncThunk(
  'treatmentPlace/fetchTreatmentPlacesByClientId',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/treatment-place/client/${clientId}`);
      const treatmentPlaces: TreatmentPlace[] = response.data;
      return treatmentPlaces;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const fetchTreatmentPlacesByDoctorId = createAsyncThunk(
  'treatmentPlace/fetchTreatmentPlacesByDoctorId',
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/treatment-place/doctor/${doctorId}`);
      const treatmentPlaces: TreatmentPlace[] = response.data;
      return treatmentPlaces;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const createTreatmentPlace = createAsyncThunk(
  'treatmentPlace/createTreatmentPlace',
  async (newQRCode: { label: string; ref_product: string; dimension: string; number_in_lot: string, lot_number: string; expiration_date: Date }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/treatment-place', newQRCode);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const generateShareableTreatmentPlaceCode = createAsyncThunk(
  'treatmentPlace/generateShareableTreatmentPlace',
  async (treatmentPlaceId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/share-treatment-place`, { treatment_place_id: treatmentPlaceId });
      return response.data.verification_code;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const useShareableTreatmentPlaceCode = createAsyncThunk(
  'treatmentPlace/useShareableTreatmentPlace',
  async (shareableCode: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/share-treatment-place/add`, { verification_code: shareableCode });
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const replaceBandage = createAsyncThunk(
  'treatmentPlace/replaceBandage',
  async (bandage: { treatment_place_id: string, label: string, ref_product: string; dimension: string; number_in_lot: string, lot_number: string; expiration_date: Date }, { rejectWithValue }) => {
    try {
      const qrcode = { label: bandage.label, ref_product: bandage.ref_product, dimension: bandage.dimension, number_in_lot: bandage.number_in_lot, lot_number: bandage.lot_number, expiration_date: bandage.expiration_date };
      const newQrcode = await api.post('/qrcode', qrcode);
      const treatmentPlace = await api.put(`/treatment-place/${bandage.treatment_place_id}`, { current_qr_code_id: newQrcode.data.id });
      const response = await api.put(`qrcode/link/${newQrcode.data.id}/${bandage.treatment_place_id}`);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const fetchSharedTreatmentPlaces = createAsyncThunk(
  'treatmentPlace/fetchSharedTreatmentPlaces',
  async (treatmentPlaceId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/share-treatment-place/shared/${treatmentPlaceId}`);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const removeSharedTreatmentPlace = createAsyncThunk(
  'treatmentPlace/removeSharedTreatmentPlace',
  async (sharedTreatmentPlaceId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/share-treatment-place/remove/${sharedTreatmentPlaceId}`);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const deleteTreatmentPlace = createAsyncThunk(
  'treatmentPlace/deleteTreatmentPlace',
  async (treatmentPlaceId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/treatment-place/${treatmentPlaceId}`);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const checkIfTreatmentPlaceExists = createAsyncThunk(
  'treatmentPlace/checkIfTreatmentPlaceExists',
  async (data: { number_in_lot: string, ref_product: string, lot_number: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/qrcode/check`, data);
      console.log(response.data);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);
