
import { Animal, Case, Medicine, Donation, ABCRecord, WildlifeCase, HousekeepingSupply, MedicineUsage, AdoptionApplication, StaffMember, Declaration } from '../types';

export const INITIAL_STAFF: StaffMember[] = [
  { 
    id: '1', 
    name: 'Dr. Anita Desai', 
    phone: '9876543210', 
    role: 'Senior Vet', 
    joined_date: '2023-01-10',
  },
  { 
    id: '2', 
    name: 'Prateek Yadav', 
    phone: '9876543211', 
    role: 'Rescue Lead', 
    joined_date: '2023-02-01',
  },
];

export const INITIAL_ANIMALS: Animal[] = [
  {
    id: 'a1',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'Male',
    health_status: 'Healthy',
    location: 'Sanctuary',
    image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
    status: 'available'
  },
  {
    id: 'a2',
    name: 'Misty',
    species: 'Cat',
    breed: 'Calico',
    age: 2,
    gender: 'Female',
    health_status: 'Recovering',
    location: 'Ward B',
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop',
    status: 'available'
  }
];

export const INITIAL_CASES: Case[] = [
  {
    id: '1',
    title: 'Golden Retriever Rescue',
    description: 'Golden Retriever, limping on front left leg, possibly a hairline fracture.',
    location: 'Central Park, Delhi',
    status: 'open',
    image_url: 'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Calico Cat Recovery',
    description: 'Calico cat found with severe dehydration and skin infection.',
    location: 'Sector 15, Rohini',
    status: 'open',
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop',
  }
];

export const INITIAL_WILDLIFE: WildlifeCase[] = [
  {
    id: 'w1',
    case_number: 'WILD-2024-001',
    date_time: '2024-02-15 09:00',
    location: 'Asola Bhatti Sanctuary',
    animal: 'Monkey',
    species: 'Rhesus Macaque',
    schedule: 'Schedule I',
    status: 'Under Treatment',
    complainant_name: 'Forest Ranger Sunil',
    complainant_phone: '9988776655',
    is_ready_for_release: false,
  }
];

export const INITIAL_HOUSEKEEPING_SUPPLIES: HousekeepingSupply[] = [
  { id: 'hk1', name: 'White Phenyl', quantity: 25, min_stock_level: 10, unit: 'Liters' },
  { id: 'hk2', name: 'Bleaching powder', quantity: 15, min_stock_level: 5, unit: 'Kg' },
];

export const INITIAL_ABC_RECORDS: ABCRecord[] = [
  { id: 'abc1', animal_id: 'a1', sterilized: true, vaccination_done: true, surgery_date: '2023-11-01', remarks: 'Community camp successful' }
];

export const INITIAL_MEDS: Medicine[] = [
  { id: 'ab1', name: 'Injection Amoxycillin Cloxacillin', category: 'Antibiotic', quantity: 50, unit: 'Vials', expiry_date: '2025-12-31', min_stock_level: 10 },
  { id: 'ab2', name: 'Injection Ceftriaxone tazobactum', category: 'Antibiotic', quantity: 8, unit: 'Vials', expiry_date: '2025-12-31', min_stock_level: 5 },
];

export const INITIAL_MEDICINE_USAGE: MedicineUsage[] = [
  { id: 'u1', medicine_id: 'ab1', medicine_name: 'Amoxycillin Cloxacillin Inj', quantity: '2 Vials', taken_by: 'Dr. Anita Desai', date_time: '20/05/2025 10:15', purpose: 'Scheduled dose for CASE-2024-001', ward: 'Ward A' },
];

export const INITIAL_ADOPTION_APPLICATIONS: AdoptionApplication[] = [
  {
    id: 'APP-101',
    app_number: '2024-101',
    adopter_name: 'Rahul Verma',
    address: '22/B, Indiranagar, Mysuru',
    phone: '9845012345',
    email: 'rahul.v@gmail.com',
    animal_type: 'Dog',
    target_gender: 'Male',
    target_color: 'Golden Brown',
    status: 'Pending Review',
    date: '2024-05-15',
    time: '10:30',
    reason: 'Loves dogs, has a large fenced backyard.',
  }
];

export const INITIAL_DECLARATIONS: Declaration[] = [
  {
    id: '1',
    form_no: 'FORM-2024-001',
    declarer_name: 'Rahul Sharma',
    address: '123, MG Road, Mysuru',
    phone: '9876543210',
    email: 'rahul@example.com',
    species: 'Dog',
    gender: 'Male',
    age: '3 years',
    description: 'Golden Retriever, healthy but aggressive towards strangers.',
    date: '2024-05-20',
    created_at: '2024-05-20T10:00:00Z'
  }
];

export const INITIAL_DONATIONS: Donation[] = [
  { id: 'D102', donor_name: 'Sameer Malhotra', amount: 25000, message: 'For the animals' }
];
