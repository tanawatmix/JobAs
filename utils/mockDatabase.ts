import { Patient } from '../types'; 

const DB_KEY = 'agnos_mock_patients';

export const getPatients = (): Patient[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePatient = (patient: Patient) => {
  if (typeof window === 'undefined') return; 

  const patients = getPatients();
  const index = patients.findIndex((p) => p.id === patient.id);
  
  if (index >= 0) {
    patients[index] = patient;
  } else {
    patients.unshift(patient);
  }

  localStorage.setItem(DB_KEY, JSON.stringify(patients));
  window.dispatchEvent(new Event('storage'));
};

export const clearPatients = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(DB_KEY);
    window.dispatchEvent(new Event('storage'));
};