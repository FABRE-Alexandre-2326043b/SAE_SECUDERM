import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth'
import qrCodeReducer from './qrCode'
import clientNoteReducer from './clientNotes'
import prescriptionReducer from './prescription'
import userReducer from './user'
import treatmentPlaceReducer from './treatmentPlace'
import fileReducer from './file'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    qrCode: qrCodeReducer,
    clientNotes: clientNoteReducer,
    prescriptions: prescriptionReducer,
    user: userReducer,
    treatmentPlace: treatmentPlaceReducer,
    file: fileReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
