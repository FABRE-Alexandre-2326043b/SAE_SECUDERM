import {createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "@/services/api";
import {ClientNote} from "@/store/types";
import { handleAxiosError } from "@/store/errors";


export const getNotes = createAsyncThunk(
  'client-notes/getNotes',
  async (treatment_place_id : string , {rejectWithValue}) => {
    try {
      const response = await api.get(`/client-notes/${treatment_place_id}`);
      const notes: ClientNote[] = response.data;
      return notes;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const createNote = createAsyncThunk(
  'client-notes/createNote',
  async (note: {treatment_place_id: string, date: Date; description: string }, {rejectWithValue}) => {
    try {
      const response = await api.post('/client-notes', note);
      const newNote: ClientNote = response.data;
      return newNote;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const updateNote = createAsyncThunk(
  'client-notes/updateNote',
  async (note: { client_note_id: string; date: Date; description: string }, {rejectWithValue}) => {
    try {
      const response = await api.put(`/client-notes/${note.client_note_id}`, note);
      return response.data;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const deleteNote = createAsyncThunk(
  'client-notes/deleteNote',
  async (client_note_id: string, {rejectWithValue}) => {
    try {
      await api.delete(`/client-notes/${client_note_id}`);
      return client_note_id;
    } catch (err) {
      return handleAxiosError(err, rejectWithValue);
    }
  }
);

export const exportToPdf = createAsyncThunk(
  'client-notes/exportToPdf',
  async (treatment_place_id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/client-notes/pdf/${treatment_place_id}`, { responseType: 'blob' });
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
