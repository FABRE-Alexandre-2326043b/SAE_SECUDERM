import { Type } from './enums';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  type: Type;
}

export interface QRCode {
  id:string,
  label: string,
  ref_product: string;
  dimension: string;
  lot_number: string;
  expiration_date: string;
  client_id: string;
}

export interface ClientNote {
  id: string,
  qr_code_id: string,
  client_id: string,
  date: Date,
  description: string,
}

export interface Prescription {
  id: string,
  qr_code_id: string,
  doctor_id: string,
  date: Date,
  description: string,
  state: boolean,
  doctor: {
    first_name: string,
    last_name: string,
  },
}

export interface TreatmentPlace {
  id: string,
  label: string,
  client_id: string,
  current_qr_code_id: string,
}

export interface SharedTreatmentPlace {
  id: string,
  treatment_place_id: string,
  doctor_id: string,
  doctor: {
    first_name: string,
    last_name: string,
  },
}

export interface File {
  id: string;
  original_name: string;
  file_url: string;
  mime_type: string;
  size: number;
  uploaded_by: string;
  treatment_place_id: string;
}
