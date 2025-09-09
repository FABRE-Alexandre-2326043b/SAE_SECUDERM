import {createNote, deleteNote, exportToPdf, getNotes, updateNote} from "@/store/clientNotesThunks";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/store/store";


export interface ClientNoteState {
  clientNotes: any[];
  pdf: any;
  pdfStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ClientNoteState = {
  clientNotes: [],
  pdf: null,
  pdfStatus: 'idle',
  status: 'idle',
  error: null,
};

export const clientNoteSlice = createSlice({
  name: 'client-notes',
  initialState,
  reducers: {
    clearClientNoteError: (state) => {
      state.error = null;
    },
    clearPdf: (state) => {
      state.pdf = null;
    },
    resetPdfStatus: (state) => {
      state.pdfStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getNotes.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.clientNotes = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createNote.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action: PayloadAction<any>) => {
        state.clientNotes.push(action.payload);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateNote.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action: PayloadAction<any>) => {
        const updatedNote = action.payload;
        const index = state.clientNotes.findIndex((note) => note.id === updatedNote.id);
        if (index !== -1) {
          state.clientNotes[index] = updatedNote;
        } else {
          state.clientNotes.push(updatedNote);
        }
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteNote.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action: PayloadAction<any>) => {
        const deletedNoteId = action.payload;
        state.clientNotes = state.clientNotes.filter((note) => note.id !== deletedNoteId);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(exportToPdf.pending, (state) => {
        state.pdfStatus = 'loading';
      })
      .addCase(exportToPdf.fulfilled, (state, action: PayloadAction<any>) => {
        state.pdf = action.payload;
        state.pdfStatus = 'succeeded';
      })
      .addCase(exportToPdf.rejected, (state, action) => {
        state.pdfStatus = 'failed';
      });
  },
});

export const { clearPdf, resetPdfStatus, clearClientNoteError } = clientNoteSlice.actions;

export const selectClientNotes = (state: RootState) => state.clientNotes.clientNotes;
export const selectClientNotesStatus = (state: RootState) => state.clientNotes.status;
export const selectClientNotesError = (state: RootState) => state.clientNotes.error;
export const selectPdf = (state: RootState) => state.clientNotes.pdf;
export const selectPdfStatus = (state: RootState) => state.clientNotes.pdfStatus;

export default clientNoteSlice.reducer;
