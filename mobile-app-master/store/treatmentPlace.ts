import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import {SharedTreatmentPlace, TreatmentPlace} from './types';
import {
  checkIfTreatmentPlaceExists,
  createTreatmentPlace, deleteTreatmentPlace, fetchSharedTreatmentPlaces,
  fetchTreatmentPlacesByClientId, fetchTreatmentPlacesByDoctorId,
  generateShareableTreatmentPlaceCode, removeSharedTreatmentPlace, replaceBandage, useShareableTreatmentPlaceCode
} from "@/store/treatmentPlaceThunks";

export interface TreatmentPlaceState {
  treatmentPlaces: TreatmentPlace[];
  redirectToTreatmentPlaceId: string | null;
  redirectToTreatmentPlaceIdStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  sharedTreatmentPlaces: SharedTreatmentPlace[];
  shareableTreatmentPlaceCode: string | null;
  shareableTreatmentPlaceCodeError: string | null;
  shareableTreatmentPlaceCodeStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  doctorShareableTreatmentPlaceCodeStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  replaceBandageStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  replaceBandageError: string | null;
  removeSharedTreatmentPlaceStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  deleteTreatmentPlaceStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TreatmentPlaceState = {
  treatmentPlaces: [],
  redirectToTreatmentPlaceId: null,
  redirectToTreatmentPlaceIdStatus: 'idle',
  sharedTreatmentPlaces: [],
  fetchStatus: 'idle',
  createStatus: 'idle',
  shareableTreatmentPlaceCodeStatus: 'idle',
  doctorShareableTreatmentPlaceCodeStatus: 'idle',
  shareableTreatmentPlaceCodeError: null,
  shareableTreatmentPlaceCode: null,
  replaceBandageStatus: 'idle',
  replaceBandageError: null,
  removeSharedTreatmentPlaceStatus: 'idle',
  deleteTreatmentPlaceStatus: 'idle',
  error: null,
};

export const treatmentPlaceSlice = createSlice({
  name: 'treatmentPlace',
  initialState,
  reducers: {
    clearTreatmentPlaceError: (state) => {
      state.error = null;
    },
    resetTreatmentPlaceFetchStatus: (state) => {
      state.fetchStatus = 'idle';
    },
    resetTreatmentPlaceCreateStatus: (state) => {
      state.createStatus = 'idle';
    },
    clearShareableTreatmentPlaceCode: (state) => {
      state.shareableTreatmentPlaceCode = null;
    },
    resetShareableTreatmentPlaceCodeStatus: (state) => {
      state.shareableTreatmentPlaceCodeStatus = 'idle';
    },
    clearReplaceBandageError: (state) => {
      state.replaceBandageError = null;
    },
    resetReplaceBandageStatus: (state) => {
      state.replaceBandageStatus = 'idle';
    },
    clearSharedTreatmentPlaces: (state) => {
      state.sharedTreatmentPlaces = [];
    },
    resetRemoveSharedTreatmentPlaceStatus: (state) => {
      state.removeSharedTreatmentPlaceStatus = 'idle';
    },
    resetDeleteTreatmentPlaceStatus: (state) => {
      state.deleteTreatmentPlaceStatus = 'idle';
    },
    resetDoctorShareableTreatmentPlaceCodeStatus: (state) => {
      state.doctorShareableTreatmentPlaceCodeStatus = 'idle';
    },
    clearRedirectToTreatmentPlaceId: (state) => {
      state.redirectToTreatmentPlaceId = null;
    },
    resetRedirectToTreatmentPlaceIdStatus: (state) => {
      state.redirectToTreatmentPlaceIdStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTreatmentPlacesByClientId.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchTreatmentPlacesByClientId.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.treatmentPlaces = action.payload;
      })
      .addCase(fetchTreatmentPlacesByClientId.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createTreatmentPlace.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createTreatmentPlace.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.treatmentPlaces.push(action.payload);
      })
      .addCase(createTreatmentPlace.rejected, (state, action) => {
        if ((action.payload as any).treatment_place_id) {
          state.createStatus = 'failed';
          state.redirectToTreatmentPlaceId = (action.payload as any).treatment_place_id;
          // state.error = (action.payload as any).message;
        } else {
          state.createStatus = 'failed';
          state.error = action.payload as string;
        }
      })
      .addCase(generateShareableTreatmentPlaceCode.pending, (state) => {
        state.shareableTreatmentPlaceCodeStatus = 'loading';
        state.error = null;
      })
      .addCase(generateShareableTreatmentPlaceCode.fulfilled, (state, action) => {
        state.shareableTreatmentPlaceCodeStatus = 'succeeded';
        state.shareableTreatmentPlaceCode = action.payload;
      })
      .addCase(generateShareableTreatmentPlaceCode.rejected, (state, action) => {
        state.shareableTreatmentPlaceCodeStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchTreatmentPlacesByDoctorId.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchTreatmentPlacesByDoctorId.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.treatmentPlaces = action.payload;
      })
      .addCase(fetchTreatmentPlacesByDoctorId.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(useShareableTreatmentPlaceCode.pending, (state) => {
        state.doctorShareableTreatmentPlaceCodeStatus = 'loading';
      })
      .addCase(useShareableTreatmentPlaceCode.fulfilled, (state) => {
        state.doctorShareableTreatmentPlaceCodeStatus = 'succeeded';
      })
      .addCase(useShareableTreatmentPlaceCode.rejected, (state, action) => {
        state.doctorShareableTreatmentPlaceCodeStatus = 'failed';
      })
      .addCase(replaceBandage.pending, (state) => {
        state.replaceBandageStatus = 'loading';
        state.error = null;
      })
      .addCase(replaceBandage.fulfilled, (state) => {
        state.replaceBandageStatus = 'succeeded';
      })
      .addCase(replaceBandage.rejected, (state, action) => {
        state.replaceBandageStatus = 'failed';
        state.replaceBandageError = action.payload as string;
      })
      .addCase(fetchSharedTreatmentPlaces.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchSharedTreatmentPlaces.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.sharedTreatmentPlaces = action.payload;
      })
      .addCase(fetchSharedTreatmentPlaces.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload as string;
      })
      .addCase(removeSharedTreatmentPlace.pending, (state) => {
        state.removeSharedTreatmentPlaceStatus = 'loading';
      })
      .addCase(removeSharedTreatmentPlace.fulfilled, (state) => {
        state.removeSharedTreatmentPlaceStatus = 'succeeded';
      })
      .addCase(removeSharedTreatmentPlace.rejected, (state, action) => {
        state.removeSharedTreatmentPlaceStatus = 'failed';
      })
      .addCase(deleteTreatmentPlace.pending, (state) => {
        state.deleteTreatmentPlaceStatus = 'loading';
      })
      .addCase(deleteTreatmentPlace.fulfilled, (state) => {
        state.deleteTreatmentPlaceStatus = 'succeeded';
      })
      .addCase(deleteTreatmentPlace.rejected, (state, action) => {
        state.deleteTreatmentPlaceStatus = 'failed';
      })
      .addCase(checkIfTreatmentPlaceExists.rejected, (state, action) => {
        state.redirectToTreatmentPlaceIdStatus = 'failed';
        console.log(action.payload);
      })
      .addCase(checkIfTreatmentPlaceExists.fulfilled, (state, action) => {
        state.redirectToTreatmentPlaceIdStatus = 'succeeded';
        state.redirectToTreatmentPlaceId = action.payload;
      });
  }
});

export const { resetRedirectToTreatmentPlaceIdStatus, clearRedirectToTreatmentPlaceId, resetDoctorShareableTreatmentPlaceCodeStatus, resetDeleteTreatmentPlaceStatus, resetRemoveSharedTreatmentPlaceStatus, clearSharedTreatmentPlaces, resetReplaceBandageStatus, clearReplaceBandageError, resetShareableTreatmentPlaceCodeStatus, clearShareableTreatmentPlaceCode, resetTreatmentPlaceCreateStatus, clearTreatmentPlaceError, resetTreatmentPlaceFetchStatus } = treatmentPlaceSlice.actions;

export const selectTreatmentPlaces = (state: RootState) => state.treatmentPlace.treatmentPlaces;
export const selectTreatmentPlaceFetchStatus = (state: RootState) => state.treatmentPlace.fetchStatus;
export const selectTreatmentPlaceError = (state: RootState) => state.treatmentPlace.error;
export const selectTreatmentPlaceCreateStatus = (state: RootState) => state.treatmentPlace.createStatus;
export const selectShareableTreatmentPlaceCode = (state: RootState) => state.treatmentPlace.shareableTreatmentPlaceCode;
export const selectShareableTreatmentPlaceCodeStatus = (state: RootState) => state.treatmentPlace.shareableTreatmentPlaceCodeStatus;
export const selectShareableTreatmentPlaceCodeError = (state: RootState) => state.treatmentPlace.shareableTreatmentPlaceCodeError;
export const selectReplaceBandageStatus = (state: RootState) => state.treatmentPlace.replaceBandageStatus;
export const selectReplaceBandageError = (state: RootState) => state.treatmentPlace.replaceBandageError;
export const selectSharedTreatmentPlaces = (state: RootState) => state.treatmentPlace.sharedTreatmentPlaces;
export const selectRemoveSharedTreatmentPlaceStatus = (state: RootState) => state.treatmentPlace.removeSharedTreatmentPlaceStatus;
export const selectDeleteStatus = (state: RootState) => state.treatmentPlace.deleteTreatmentPlaceStatus;
export const selectDoctorShareableTreatmentPlaceCodeStatus = (state: RootState) => state.treatmentPlace.doctorShareableTreatmentPlaceCodeStatus;
export const selectRedirectToTreatmentPlaceId = (state: RootState) => state.treatmentPlace.redirectToTreatmentPlaceId;
export const selectRedirectToTreatmentPlaceIdStatus = (state: RootState) => state.treatmentPlace.redirectToTreatmentPlaceIdStatus;

export default treatmentPlaceSlice.reducer;
