import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
  createPrescription,
  deletePrescription,
  exportToPdf,
  getPrescription,
  updatePrescription
} from "@/store/prescriptionThunks";


export interface PrescriptionState {
  prescriptions: any[];
  pdf: any;
  pdfStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PrescriptionState = {
  prescriptions: [],
  pdf: null,
  pdfStatus: 'idle',
  status: 'idle',
  error: null,
};

export const prescriptionSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    clearPrescriptionError: (state) => {
      state.error = null;
    },
    clearPrescriptionPdf: (state) => {
      state.pdf = null;
    },
    resetPrescriptionPdfStatus: (state) => {
      state.pdfStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPrescription.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getPrescription.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.prescriptions = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getPrescription.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createPrescription.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createPrescription.fulfilled, (state, action: PayloadAction<any>) => {
        state.prescriptions.push(action.payload);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updatePrescription.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updatePrescription.fulfilled, (state, action: PayloadAction<any>) => {
        const updatedPrescription = action.payload;
        const index = state.prescriptions.findIndex((prescription) => prescription.id === updatedPrescription.id);
        if (index !== -1) {
          state.prescriptions[index] = updatedPrescription;
        }
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updatePrescription.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deletePrescription.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deletePrescription.fulfilled, (state, action: PayloadAction<string>) => {
        const prescriptionId = action.payload;
        state.prescriptions = state.prescriptions.filter((prescription) => prescription.id !== prescriptionId);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(deletePrescription.rejected, (state, action) => {
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

export const { clearPrescriptionPdf, resetPrescriptionPdfStatus, clearPrescriptionError } = prescriptionSlice.actions;

export const selectPrescriptions = (state: { prescriptions: PrescriptionState }) => state.prescriptions.prescriptions;
export const selectPrescriptionStatus = (state: { prescriptions: PrescriptionState }) => state.prescriptions.status;
export const selectPrescriptionError = (state: { prescriptions: PrescriptionState }) => state.prescriptions.error;
export const selectPrescriptionPdf = (state: { prescriptions: PrescriptionState }) => state.prescriptions.pdf;
export const selectPrescriptionPdfStatus = (state: { prescriptions: PrescriptionState }) => state.prescriptions.pdfStatus;

export default prescriptionSlice.reducer;
