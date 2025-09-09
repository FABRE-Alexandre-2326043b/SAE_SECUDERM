import {createAsyncThunk} from "@reduxjs/toolkit";
import {Prescription} from "@/store/types";
import {api} from "@/services/api";
import {handleAxiosError} from "@/store/errors";


export const getPrescription = createAsyncThunk(
  'prescriptions/getPrescriptions',
  async (treatment_place_id : string , {rejectWithValue}) => {
    try {
      const response = await api.get(`/prescription/${treatment_place_id}`);
      const prescriptions: Prescription[] = response.data;
      return prescriptions;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const createPrescription = createAsyncThunk(
  'prescriptions/createPrescription',
  async (prescription: {treatment_place_id: string, date: Date; description: string, state: boolean },
         {rejectWithValue}) => {
    try {
      const response = await api.post('/prescription', prescription);
      const newPrescription: Prescription = response.data;
      return newPrescription;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const updatePrescription = createAsyncThunk(
  'prescriptions/updatePrescription',
  async (prescription: { prescription_id: string; date: Date; description: string, state: boolean }, {rejectWithValue}) => {
    try {
      const response = await api.put(`/prescription/${prescription.prescription_id}`, prescription);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const deletePrescription = createAsyncThunk(
  'prescriptions/deletePrescription',
  async (prescription_id: string, {rejectWithValue}) => {
    try {
      await api.delete(`/prescription/${prescription_id}`);
      return prescription_id;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const exportToPdf = createAsyncThunk(
  'prescriptions/exportToPdf',
  async (treatment_place_id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/prescription/pdf/${treatment_place_id}`, { responseType: 'blob' });
      const blob = response.data;

      const reader = new FileReader();
      return new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);
