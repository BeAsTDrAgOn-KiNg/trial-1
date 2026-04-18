
export type Role = 'Admin' | 'Doctor' | 'Data Entry';

export interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  phone?: string;
  created_at?: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: Role;
}

export interface Animal {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  gender?: string;
  health_status?: string;
  location?: string;
  image_url?: string;
  status: string;
  created_at?: string;
}

export enum CaseStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  UNDER_TREATMENT = 'under_treatment',
  RECOVERY = 'recovery',
  CRITICAL = 'critical',
  RELEASED = 'released',
  PERMANENT = 'permanent',
  DECEASED = 'deceased'
}

export interface Case {
  id: string;
  title: string;
  description: string;
  location: string;
  status: CaseStatus | string;
  reported_by?: string; // user_id
  image_url?: string;
  created_at?: string;
}

export interface ClinicalEntry {
  id: string;
  case_id: string;
  date: string;
  symptoms?: string;
  diagnosis: string;
  treatment: string;
  doctor_name: string;
  created_at?: string;
}

export interface WildlifeCase {
  id: string;
  case_number: string;
  date_time: string;
  animal: string;
  species: string;
  schedule: string;
  location: string;
  status: string;
  complainant_name: string;
  complainant_phone: string;
  forest_dept_contact?: string;
  release_plan?: string;
  is_ready_for_release: boolean;
  sent_for?: string;
  destination?: string;
  correspondence?: string;
  signature?: string;
  reported_date?: string;
  resolved_date?: string;
  image_url?: string;
  created_at?: string;
}

export interface ABCRecord {
  id: string;
  animal_id: string;
  sterilized: boolean;
  vaccination_done: boolean;
  surgery_date: string;
  remarks?: string;
  created_at?: string;
}

export interface AdoptionApplication {
  id: string;
  app_number: string;
  adopter_name: string;
  address: string;
  phone: string;
  email: string;
  animal_type: string;
  target_gender: string;
  target_color: string;
  status: string;
  date: string;
  time: string;
  description?: string;
  id_proof?: string;
  house_type?: string;
  has_other_pets?: string;
  vet_name?: string;
  reason?: string;
  created_at?: string;
}

export interface Adoption {
  id: string;
  animal_id: string;
  user_id: string;
  status: string;
  notes?: string;
  created_at?: string;
}

export interface Declaration {
  id: string;
  form_no: string;
  declarer_name: string;
  address: string;
  phone: string;
  email: string;
  species: string;
  gender: string;
  age: string;
  description: string;
  date: string;
  created_at?: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  message?: string;
  payment_id?: string;
  created_at?: string;
}

export interface HousekeepingSupply {
  id: string;
  name: string;
  quantity: number;
  min_stock_level: number;
  unit: string;
  created_at?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  min_stock_level?: number;
  last_restocked?: string;
  created_at?: string;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry_date?: string;
  min_stock_level: number;
  created_at?: string;
}

export interface MedicineUsage {
  id: string;
  medicine_id: string;
  medicine_name: string;
  quantity: string;
  taken_by: string;
  date_time: string;
  purpose: string;
  ward?: string;
  created_at?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  joined_date: string;
  bank_full_name?: string;
  bank_name?: string;
  bank_branch?: string;
  ifsc_code?: string;
  account_number?: string;
  salary?: number;
  created_at?: string;
}
