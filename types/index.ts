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
  emergency_contact_name?: string;
  chronic_disease?: string; // โรคประจำตัว
  allergies?: string; // อาการแพ้
  emergency_contact_rel?: string;
  religion?: string;
  status: PatientStatus;
  updated_at: string;
}