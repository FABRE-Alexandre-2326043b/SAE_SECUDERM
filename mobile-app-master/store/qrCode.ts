import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import {
  createQRCode,
  createShareQRCode,
  getQRCode,
  getQRCodesByClientId,
  getQRCodesByDoctorId,
  linkDoctorToQRCode, linkTreatmentPlaceToQRCode
} from './qrCodeThunks';

export interface QRCodeState {
  qrCodes: any[];
  shareQRCodeId: string | null;
  verificationQRCodeId: string | null;
  sharingStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  doctorLinkingStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  treatmentPlaceLinkingStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QRCodeState = {
  qrCodes: [],
  shareQRCodeId: null,
  verificationQRCodeId: null,
  doctorLinkingStatus: 'idle',
  sharingStatus: 'idle',
  createStatus: 'idle',
  fetchStatus: 'idle',
  treatmentPlaceLinkingStatus: 'idle',
  error: null,
};

export const qrCodeSlice = createSlice({
  name: 'qrcode',
  initialState,
  reducers: {
    clearQRCodeError: (state) => {
      state.error = null;
    },
    resetQRCodeCreateStatus: (state) => {
      state.createStatus = 'idle';
    },
    resetQRCodeFetchStatus: (state) => {
      state.fetchStatus = 'idle';
    },
    setShareQRCodeId: (state, action: PayloadAction<string>) => {
      state.shareQRCodeId = action.payload;
    },
    clearShareQRCodeId: (state) => {
      state.shareQRCodeId = null;
    },
    clearVerificationQRCodeId: (state) => {
      state.verificationQRCodeId = null;
    },
    resetQRCodeSharingStatus: (state) => {
      state.sharingStatus = 'idle';
    },
    resetDoctorLinkingStatus: (state) => {
      state.doctorLinkingStatus = 'idle';
    },
    resetTreatmentPlaceLinkingStatus: (state) => {
      state.treatmentPlaceLinkingStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createQRCode.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createQRCode.fulfilled, (state, action: PayloadAction<any>) => {
        state.qrCodes.push(action.payload);
        state.createStatus = 'succeeded';
        state.error = null;
      })
      .addCase(createQRCode.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(getQRCodesByClientId.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(getQRCodesByClientId.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.qrCodes = action.payload;
        state.fetchStatus = 'succeeded';
        state.error = null;
      })
      .addCase(getQRCodesByClientId.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(getQRCode.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(getQRCode.fulfilled, (state, action: PayloadAction<any>) => {
        state.qrCodes.push(action.payload);
        state.fetchStatus = 'succeeded';
        state.error = null;
      })
      .addCase(getQRCode.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createShareQRCode.pending, (state) => {
        state.sharingStatus = 'loading';
        state.error = null;
      })
      .addCase(createShareQRCode.fulfilled, (state, action: PayloadAction<any>) => {
        state.verificationQRCodeId = action.payload?.verification_code;
        state.sharingStatus = 'succeeded';
        state.error = null;
      })
      .addCase(createShareQRCode.rejected, (state, action) => {
        state.sharingStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(linkDoctorToQRCode.pending, (state) => {
        state.doctorLinkingStatus = 'loading';
        state.error = null;
      })
      .addCase(linkDoctorToQRCode.fulfilled, (state) => {
        state.doctorLinkingStatus = 'succeeded';
        state.error = null;
      })
      .addCase(linkDoctorToQRCode.rejected, (state, action) => {
        state.doctorLinkingStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(getQRCodesByDoctorId.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(getQRCodesByDoctorId.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.qrCodes = action.payload;
        state.fetchStatus = 'succeeded';
        state.error = null;
      })
      .addCase(getQRCodesByDoctorId.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(linkTreatmentPlaceToQRCode.pending, (state) => {
        state.treatmentPlaceLinkingStatus = 'loading';
        state.error = null;
      })
      .addCase(linkTreatmentPlaceToQRCode.fulfilled, (state) => {
        state.treatmentPlaceLinkingStatus = 'succeeded';
        state.error = null;
        console.log('Treatment place linked to QR code');
      })
      .addCase(linkTreatmentPlaceToQRCode.rejected, (state, action) => {
        state.treatmentPlaceLinkingStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetTreatmentPlaceLinkingStatus, clearQRCodeError, resetQRCodeFetchStatus, resetQRCodeCreateStatus, resetQRCodeSharingStatus, clearVerificationQRCodeId, clearShareQRCodeId, setShareQRCodeId, resetDoctorLinkingStatus } = qrCodeSlice.actions;

export const selectQRCodes = (state: RootState) => state.qrCode.qrCodes;
export const selectQrCodeCreateStatus = (state: RootState) => state.qrCode.createStatus;
export const selectQrCodeFetchStatus = (state: RootState) => state.qrCode.fetchStatus;
export const selectQrCodeError = (state: RootState) => state.qrCode.error;
export const selectShareQRCodeId = (state: RootState) => state.qrCode.shareQRCodeId;
export const selectVerificationQRCodeId = (state: RootState) => state.qrCode.verificationQRCodeId;
export const selectSharingStatus = (state: RootState) => state.qrCode.sharingStatus;
export const selectDoctorLinkingStatus = (state: RootState) => state.qrCode.doctorLinkingStatus;
export const selectTreatmentPlaceLinkingStatus = (state: RootState) => state.qrCode.treatmentPlaceLinkingStatus;

export default qrCodeSlice.reducer;
