
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Animal,
  Case, 
  ClinicalEntry,
  Medicine, 
  Donation, 
  AdoptionApplication,
  Adoption,
  ABCRecord, 
  WildlifeCase, 
  Declaration,
  HousekeepingSupply, 
  MedicineUsage,
  StaffMember,
  InventoryItem,
  UserProfile
} from '../types';
import { supabase } from '../lib/supabase';

interface AppContextType {
  animals: Animal[];
  cases: Case[];
  clinicalEntries: ClinicalEntry[];
  wildlifeCases: WildlifeCase[];
  declarations: Declaration[];
  medicines: Medicine[];
  donations: Donation[];
  adoptions: Adoption[];
  adoptionApplications: AdoptionApplication[];
  abcRecords: ABCRecord[];
  housekeepingSupplies: HousekeepingSupply[];
  inventoryItems: InventoryItem[];
  medicineUsage: MedicineUsage[];
  staff: StaffMember[];
  userProfiles: UserProfile[];
  isLoading: boolean;
  
  // Actions
  addAnimal: (animal: Animal) => void;
  updateAnimal: (animal: Animal) => void;
  addCase: (newCase: Case) => void;
  updateCase: (updatedCase: Case) => void;
  addClinicalEntry: (entry: ClinicalEntry) => void;
  addWildlifeCase: (newCase: WildlifeCase) => void;
  addDeclaration: (record: Declaration) => void;
  updateDeclaration: (record: Declaration) => void;
  addMedicine: (newMed: Medicine) => void;
  updateMedicineQuantity: (id: string, newQuantity: number) => void;
  deleteMedicine: (id: string) => void;
  deleteDonation: (id: string) => void;
  deleteAdoption: (id: string) => void;
  deleteAdoptionApplication: (id: string) => void;
  deleteABCRecord: (id: string) => void;
  deleteHousekeepingSupply: (id: string) => void;
  deleteInventoryItem: (id: string) => void;
  deleteMedicineUsage: (id: string) => void;
  deleteStaff: (id: string) => void;
  deleteAnimal: (id: string) => void;
  deleteCase: (id: string) => void;
  deleteClinicalEntry: (id: string) => void;
  deleteDeclaration: (id: string) => void;
  addDonation: (donation: Donation) => void;
  addAdoption: (adoption: Adoption) => void;
  addAdoptionApplication: (application: AdoptionApplication) => void;
  updateAdoptionApplication: (application: AdoptionApplication) => void;
  addABCRecord: (record: ABCRecord) => void;
  updateABCRecord: (record: ABCRecord) => void;
  addHousekeepingSupply: (supply: HousekeepingSupply) => void;
  updateHousekeepingSupply: (supply: HousekeepingSupply) => void;
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  addMedicineUsage: (usage: MedicineUsage) => void;
  addStaff: (member: StaffMember) => void;
  updateStaff: (member: StaffMember) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [clinicalEntries, setClinicalEntries] = useState<ClinicalEntry[]>([]);
  const [wildlifeCases, setWildlifeCases] = useState<WildlifeCase[]>([]);
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [adoptionApplications, setAdoptionApplications] = useState<AdoptionApplication[]>([]);
  const [abcRecords, setAbcRecords] = useState<ABCRecord[]>([]);
  const [housekeepingSupplies, setHousekeepingSupplies] = useState<HousekeepingSupply[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [medicineUsage, setMedicineUsage] = useState<MedicineUsage[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const [
          { data: animalsData },
          { data: casesData },
          { data: clinicalData },
          { data: wildlifeData },
          { data: declarationsData },
          { data: medicinesData },
          { data: donationsData },
          { data: applicationsData },
          { data: abcData },
          { data: housekeepingData },
          { data: usageData },
          { data: staffData }
        ] = await Promise.all([
          supabase.from('animals').select('*').order('createdAt', { ascending: false }),
          supabase.from('cases').select('*').order('createdAt', { ascending: false }),
          supabase.from('clinical_entries').select('*').order('createdAt', { ascending: false }),
          supabase.from('wildlife_cases').select('*').order('createdAt', { ascending: false }),
          supabase.from('declarations').select('*').order('createdAt', { ascending: false }),
          supabase.from('medicines').select('*').order('name', { ascending: true }),
          supabase.from('donations').select('*').order('createdAt', { ascending: false }),
          supabase.from('adoption_applications').select('*').order('createdAt', { ascending: false }),
          supabase.from('abc_records').select('*').order('createdAt', { ascending: false }),
          supabase.from('housekeeping_supplies').select('*').order('name', { ascending: true }),
          supabase.from('medicine_usage').select('*').order('createdAt', { ascending: false }),
          supabase.from('staff').select('*').order('name', { ascending: true })
        ]);

        if (animalsData) setAnimals(animalsData);
        if (casesData) setCases(casesData);
        if (clinicalData) setClinicalEntries(clinicalData);
        if (wildlifeData) setWildlifeCases(wildlifeData);
        if (declarationsData) setDeclarations(declarationsData);
        if (medicinesData) setMedicines(medicinesData);
        if (donationsData) setDonations(donationsData);
        if (applicationsData) setAdoptionApplications(applicationsData);
        if (abcData) setAbcRecords(abcData);
        if (housekeepingData) setHousekeepingSupplies(housekeepingData);
        if (usageData) setMedicineUsage(usageData);
        if (staffData) setStaff(staffData);
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscriptions
    const channels = [
      supabase.channel('public:animals').on('postgres_changes', { event: '*', schema: 'public', table: 'animals' }, fetchData),
      supabase.channel('public:cases').on('postgres_changes', { event: '*', schema: 'public', table: 'cases' }, fetchData),
      supabase.channel('public:clinical_entries').on('postgres_changes', { event: '*', schema: 'public', table: 'clinical_entries' }, fetchData),
      supabase.channel('public:wildlife_cases').on('postgres_changes', { event: '*', schema: 'public', table: 'wildlife_cases' }, fetchData),
      supabase.channel('public:medicines').on('postgres_changes', { event: '*', schema: 'public', table: 'medicines' }, fetchData),
      supabase.channel('public:donations').on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, fetchData)
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  const addAnimal = async (animal: Animal) => {
    const { error } = await supabase.from('animals').insert([animal]);
    if (error) console.error('Error adding animal:', error);
  };

  const updateAnimal = async (animal: Animal) => {
    const { error } = await supabase.from('animals').update(animal).eq('id', animal.id);
    if (error) console.error('Error updating animal:', error);
  };
  
  const addCase = async (newCase: Case) => {
    const { error } = await supabase.from('cases').insert([newCase]);
    if (error) console.error('Error adding case:', error);
  };

  const updateCase = async (updatedCase: Case) => {
    const { error } = await supabase.from('cases').update(updatedCase).eq('id', updatedCase.id);
    if (error) console.error('Error updating case:', error);
  };
  
  const addClinicalEntry = async (entry: ClinicalEntry) => {
    const { error } = await supabase.from('clinical_entries').insert([entry]);
    if (error) console.error('Error adding clinical entry:', error);
  };

  const addWildlifeCase = async (newCase: WildlifeCase) => {
    const { error } = await supabase.from('wildlife_cases').insert([newCase]);
    if (error) console.error('Error adding wildlife case:', error);
  };

  const addDeclaration = async (record: Declaration) => {
    const { error } = await supabase.from('declarations').insert([record]);
    if (error) console.error('Error adding declaration:', error);
  };

  const updateDeclaration = async (record: Declaration) => {
    const { error } = await supabase.from('declarations').update(record).eq('id', record.id);
    if (error) console.error('Error updating declaration:', error);
  };

  const addMedicine = async (newMed: Medicine) => {
    const { error } = await supabase.from('medicines').insert([newMed]);
    if (error) console.error('Error adding medicine:', error);
  };

  const updateMedicineQuantity = async (id: string, newQuantity: number) => {
    const { error } = await supabase.from('medicines').update({ quantity: newQuantity }).eq('id', id);
    if (error) console.error('Error updating medicine quantity:', error);
  };

  const deleteMedicine = async (id: string) => {
    const { error } = await supabase.from('medicines').delete().eq('id', id);
    if (error) console.error('Error deleting medicine:', error);
  };

  const deleteDonation = async (id: string) => {
    const { error } = await supabase.from('donations').delete().eq('id', id);
    if (error) console.error('Error deleting donation:', error);
  };

  const deleteAdoption = async (id: string) => {
    const { error } = await supabase.from('adoptions').delete().eq('id', id);
    if (error) console.error('Error deleting adoption:', error);
  };

  const deleteAdoptionApplication = async (id: string) => {
    const { error } = await supabase.from('adoption_applications').delete().eq('id', id);
    if (error) console.error('Error deleting adoption application:', error);
  };

  const deleteABCRecord = async (id: string) => {
    const { error } = await supabase.from('abc_records').delete().eq('id', id);
    if (error) console.error('Error deleting ABC record:', error);
  };

  const deleteHousekeepingSupply = async (id: string) => {
    const { error } = await supabase.from('housekeeping_supplies').delete().eq('id', id);
    if (error) console.error('Error deleting housekeeping supply:', error);
  };

  const deleteInventoryItem = async (id: string) => {
    const { error } = await supabase.from('inventory_items').delete().eq('id', id);
    if (error) console.error('Error deleting inventory item:', error);
  };

  const deleteMedicineUsage = async (id: string) => {
    const { error } = await supabase.from('medicine_usage').delete().eq('id', id);
    if (error) console.error('Error deleting medicine usage:', error);
  };

  const deleteStaff = async (id: string) => {
    const { error } = await supabase.from('staff').delete().eq('id', id);
    if (error) console.error('Error deleting staff member:', error);
  };

  const deleteAnimal = async (id: string) => {
    const { error } = await supabase.from('animals').delete().eq('id', id);
    if (error) console.error('Error deleting animal:', error);
  };

  const deleteCase = async (id: string) => {
    const { error } = await supabase.from('cases').delete().eq('id', id);
    if (error) console.error('Error deleting case:', error);
  };

  const deleteClinicalEntry = async (id: string) => {
    const { error } = await supabase.from('clinical_entries').delete().eq('id', id);
    if (error) console.error('Error deleting clinical entry:', error);
  };

  const deleteDeclaration = async (id: string) => {
    const { error } = await supabase.from('declarations').delete().eq('id', id);
    if (error) console.error('Error deleting declaration:', error);
  };

  const addDonation = async (donation: Donation) => {
    const { error } = await supabase.from('donations').insert([donation]);
    if (error) console.error('Error adding donation:', error);
  };

  const addAdoption = async (adoption: Adoption) => {
    const { error } = await supabase.from('adoptions').insert([adoption]);
    if (error) console.error('Error adding adoption:', error);
  };

  const addAdoptionApplication = async (application: AdoptionApplication) => {
    const { error } = await supabase.from('adoption_applications').insert([application]);
    if (error) console.error('Error adding adoption application:', error);
  };

  const updateAdoptionApplication = async (application: AdoptionApplication) => {
    const { error } = await supabase.from('adoption_applications').update(application).eq('id', application.id);
    if (error) console.error('Error updating adoption application:', error);
  };

  const addABCRecord = async (record: ABCRecord) => {
    const { error } = await supabase.from('abc_records').insert([record]);
    if (error) console.error('Error adding ABC record:', error);
  };

  const updateABCRecord = async (record: ABCRecord) => {
    const { error } = await supabase.from('abc_records').update(record).eq('id', record.id);
    if (error) console.error('Error updating ABC record:', error);
  };

  const addHousekeepingSupply = async (supply: HousekeepingSupply) => {
    const { error } = await supabase.from('housekeeping_supplies').insert([supply]);
    if (error) console.error('Error adding housekeeping supply:', error);
  };

  const updateHousekeepingSupply = async (supply: HousekeepingSupply) => {
    const { error } = await supabase.from('housekeeping_supplies').update(supply).eq('id', supply.id);
    if (error) console.error('Error updating housekeeping supply:', error);
  };

  const addInventoryItem = async (item: InventoryItem) => {
    const { error } = await supabase.from('inventory_items').insert([item]);
    if (error) console.error('Error adding inventory item:', error);
  };

  const updateInventoryItem = async (item: InventoryItem) => {
    const { error } = await supabase.from('inventory_items').update(item).eq('id', item.id);
    if (error) console.error('Error updating inventory item:', error);
  };

  const addMedicineUsage = async (usage: MedicineUsage) => {
    const { error } = await supabase.from('medicine_usage').insert([usage]);
    if (error) console.error('Error adding medicine usage:', error);
  };

  const addStaff = async (member: StaffMember) => {
    const { error } = await supabase.from('staff').insert([member]);
    if (error) console.error('Error adding staff member:', error);
  };

  const updateStaff = async (member: StaffMember) => {
    const { error } = await supabase.from('staff').update(member).eq('id', member.id);
    if (error) console.error('Error updating staff member:', error);
  };

  return (
    <AppContext.Provider value={{
      animals,
      cases,
      clinicalEntries,
      wildlifeCases,
      declarations,
      medicines,
      donations,
      adoptions,
      adoptionApplications,
      abcRecords,
      housekeepingSupplies,
      inventoryItems,
      medicineUsage,
      staff,
      userProfiles,
      isLoading,
      addAnimal,
      updateAnimal,
      addCase,
      updateCase,
      addClinicalEntry,
      addWildlifeCase,
      addDeclaration,
      updateDeclaration,
      addMedicine,
      updateMedicineQuantity,
      deleteMedicine,
      deleteDonation,
      deleteAdoption,
      deleteAdoptionApplication,
      deleteABCRecord,
      deleteHousekeepingSupply,
      deleteInventoryItem,
      deleteMedicineUsage,
      deleteStaff,
      deleteAnimal,
      deleteCase,
      deleteClinicalEntry,
      deleteDeclaration,
      addDonation,
      addAdoption,
      addAdoptionApplication,
      updateAdoptionApplication,
      addABCRecord,
      updateABCRecord,
      addHousekeepingSupply,
      updateHousekeepingSupply,
      addInventoryItem,
      updateInventoryItem,
      addMedicineUsage,
      addStaff,
      updateStaff
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
