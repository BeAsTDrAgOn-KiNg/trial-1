
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
import { 
  INITIAL_ANIMALS,
  INITIAL_CASES, 
  INITIAL_MEDS, 
  INITIAL_DONATIONS, 
  INITIAL_ADOPTION_APPLICATIONS,
  INITIAL_ABC_RECORDS, 
  INITIAL_WILDLIFE, 
  INITIAL_DECLARATIONS,
  INITIAL_HOUSEKEEPING_SUPPLIES, 
  INITIAL_MEDICINE_USAGE,
  INITIAL_STAFF
} from '../data/initialData';

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
  addDonation: (donation: Donation) => void;
  addAdoption: (adoption: Adoption) => void;
  addAdoptionApplication: (application: AdoptionApplication) => void;
  updateAdoptionApplication: (application: AdoptionApplication) => void;
  addABCRecord: (record: ABCRecord) => void;
  updateABCRecord: (record: ABCRecord) => void;
  addHousekeepingSupply: (supply: HousekeepingSupply) => void;
  updateHousekeepingSupply: (supply: HousekeepingSupply) => void;
  deleteHousekeepingSupply: (id: string) => void;
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnimals(INITIAL_ANIMALS);
      setCases(INITIAL_CASES);
      setWildlifeCases(INITIAL_WILDLIFE);
      setDeclarations(INITIAL_DECLARATIONS);
      setMedicines(INITIAL_MEDS);
      setDonations(INITIAL_DONATIONS);
      setAdoptionApplications(INITIAL_ADOPTION_APPLICATIONS);
      setAbcRecords(INITIAL_ABC_RECORDS);
      setHousekeepingSupplies(INITIAL_HOUSEKEEPING_SUPPLIES);
      setMedicineUsage(INITIAL_MEDICINE_USAGE);
      setStaff(INITIAL_STAFF);
      
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const addAnimal = (animal: Animal) => setAnimals(prev => [animal, ...prev]);
  const updateAnimal = (animal: Animal) => setAnimals(prev => prev.map(a => a.id === animal.id ? animal : a));
  
  const addCase = (newCase: Case) => setCases(prev => [newCase, ...prev]);
  const updateCase = (updatedCase: Case) => setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
  
  const addClinicalEntry = (entry: ClinicalEntry) => setClinicalEntries(prev => [entry, ...prev]);

  const addWildlifeCase = (newCase: WildlifeCase) => setWildlifeCases(prev => [newCase, ...prev]);

  const addDeclaration = (record: Declaration) => setDeclarations(prev => [record, ...prev]);
  const updateDeclaration = (record: Declaration) => setDeclarations(prev => prev.map(r => r.id === record.id ? record : r));

  const addMedicine = (newMed: Medicine) => setMedicines(prev => [newMed, ...prev]);
  const updateMedicineQuantity = (id: string, newQuantity: number) => setMedicines(prev => prev.map(m => m.id === id ? { ...m, quantity: newQuantity } : m));
  const deleteMedicine = (id: string) => setMedicines(prev => prev.filter(m => m.id !== id));

  const addDonation = (donation: Donation) => setDonations(prev => [donation, ...prev]);

  const addAdoption = (adoption: Adoption) => setAdoptions(prev => [adoption, ...prev]);

  const addAdoptionApplication = (application: AdoptionApplication) => setAdoptionApplications(prev => [application, ...prev]);
  const updateAdoptionApplication = (application: AdoptionApplication) => setAdoptionApplications(prev => prev.map(a => a.id === application.id ? application : a));

  const addABCRecord = (record: ABCRecord) => setAbcRecords(prev => [record, ...prev]);
  const updateABCRecord = (record: ABCRecord) => setAbcRecords(prev => prev.map(r => r.id === record.id ? record : r));

  const addHousekeepingSupply = (supply: HousekeepingSupply) => setHousekeepingSupplies(prev => [supply, ...prev]);
  const updateHousekeepingSupply = (supply: HousekeepingSupply) => setHousekeepingSupplies(prev => prev.map(s => s.id === supply.id ? supply : s));
  const deleteHousekeepingSupply = (id: string) => setHousekeepingSupplies(prev => prev.filter(s => s.id !== id));

  const addInventoryItem = (item: InventoryItem) => setInventoryItems(prev => [item, ...prev]);
  const updateInventoryItem = (item: InventoryItem) => setInventoryItems(prev => prev.map(i => i.id === item.id ? item : i));

  const addMedicineUsage = (usage: MedicineUsage) => setMedicineUsage(prev => [usage, ...prev]);

  const addStaff = (member: StaffMember) => setStaff(prev => [member, ...prev]);
  const updateStaff = (member: StaffMember) => setStaff(prev => prev.map(s => s.id === member.id ? member : s));

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
      addDonation,
      addAdoption,
      addAdoptionApplication,
      updateAdoptionApplication,
      addABCRecord,
      updateABCRecord,
      addHousekeepingSupply,
      updateHousekeepingSupply,
      deleteHousekeepingSupply,
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
