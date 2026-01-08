export type PatientStatus = 'filling' | 'submitted' | 'inactive';

export interface Patient {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  pref_language?: string;
  nationality?: string;
  religion?: string;
  emergency_contact_name?: string;
  emergency_contact_rel?: string;
  chronic_disease?: string; // โรคประจำตัว
  allergies?: string;       // สิ่งที่แพ้
  status: PatientStatus;
  updated_at: string;
}