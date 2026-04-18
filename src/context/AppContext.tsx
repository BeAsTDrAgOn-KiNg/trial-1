
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
  INITIAL_WILDLIFE, 
  INITIAL_DECLARATIONS, 
  INITIAL_MEDS, 
  INITIAL_DONATIONS, 
  INITIAL_ADOPTION_APPLICATIONS, 
  INITIAL_ABC_RECORDS, 
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

  // Initialize from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          animalsRes, 
          casesRes, 
          wildlifeRes, 
          staffRes, 
          medsRes, 
          houseRes, 
          donationsRes, 
          appsRes,
          entriesRes,
          abcRes,
          declRes,
          usageRes,
          itemsRes,
          adoptionsRes,
          usersRes
        ] = await Promise.all([
          fetch('/api/animals'),
          fetch('/api/cases'),
          fetch('/api/wildlife'),
          fetch('/api/staff'),
          fetch('/api/inventory/medicines'),
          fetch('/api/inventory/housekeeping'),
          fetch('/api/donations'),
          fetch('/api/adoptions/applications'),
          fetch('/api/clinical-entries'),
          fetch('/api/abc-records'),
          fetch('/api/declarations'),
          fetch('/api/medicine-usages'),
          fetch('/api/inventory/items'),
          fetch('/api/adoptions'),
          fetch('/api/users')
        ]);

        if (animalsRes.ok) setAnimals(await animalsRes.json());
        if (casesRes.ok) setCases(await casesRes.json());
        if (wildlifeRes.ok) setWildlifeCases(await wildlifeRes.json());
        if (staffRes.ok) setStaff(await staffRes.json());
        if (medsRes.ok) setMedicines(await medsRes.json());
        if (houseRes.ok) setHousekeepingSupplies(await houseRes.json());
        if (donationsRes.ok) setDonations(await donationsRes.json());
        if (appsRes.ok) setAdoptionApplications(await appsRes.json());
        if (entriesRes.ok) setClinicalEntries(await entriesRes.json());
        if (abcRes.ok) setAbcRecords(await abcRes.json());
        if (declRes.ok) setDeclarations(await declRes.json());
        if (usageRes.ok) setMedicineUsage(await usageRes.json());
        if (itemsRes.ok) setInventoryItems(await itemsRes.json());
        if (adoptionsRes.ok) setAdoptions(await adoptionsRes.json());
        if (usersRes.ok) setUserProfiles(await usersRes.json());

      } catch (err) {
        console.error('Failed to load data from backend:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addAnimal = async (animal: Animal) => {
    try {
      const { id, ...data } = animal; // Let prisma generate ID if it's a UUID model
      const res = await fetch('/api/animals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setAnimals(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error adding animal:', err);
    }
  };

  const updateAnimal = async (animal: Animal) => {
    try {
      const res = await fetch(`/api/animals/${animal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animal),
      });
      if (res.ok) {
        const saved = await res.json();
        setAnimals(prev => prev.map(a => a.id === saved.id ? saved : a));
      }
    } catch (err) {
      console.error('Error updating animal:', err);
    }
  };
  
  const addCase = async (newCase: Case) => {
    try {
      const { id, ...data } = newCase;
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setCases(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error adding case:', err);
    }
  };

  const updateCase = async (updatedCase: Case) => {
    try {
      const res = await fetch(`/api/cases/${updatedCase.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCase),
      });
      if (res.ok) {
        const saved = await res.json();
        setCases(prev => prev.map(c => c.id === saved.id ? saved : c));
      }
    } catch (err) {
      console.error('Error updating case:', err);
    }
  };
  
  const addClinicalEntry = async (entry: ClinicalEntry) => {
    try {
      const { id, ...data } = entry;
      const res = await fetch('/api/clinical-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setClinicalEntries(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error adding clinical entry:', err);
    }
  };

  const addWildlifeCase = async (newCase: WildlifeCase) => {
    try {
      const { id, ...data } = newCase;
      const res = await fetch('/api/wildlife', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setWildlifeCases(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error adding wildlife case:', err);
    }
  };

  const addDeclaration = async (record: Declaration) => {
    try {
      const { id, ...data } = record;
      const res = await fetch('/api/declarations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setDeclarations(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error adding declaration:', err);
    }
  };

  const updateDeclaration = (record: Declaration) => {
    setDeclarations(prev => prev.map(d => d.id === record.id ? record : d));
  };

  const addMedicine = async (newMed: Medicine) => {
    try {
      const { id, ...data } = newMed;
      const res = await fetch('/api/inventory/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setMedicines(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error adding medicine:', err);
    }
  };

  const updateMedicineQuantity = async (id: string, newQuantity: number) => {
    try {
      const res = await fetch(`/api/inventory/medicines/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (res.ok) {
        setMedicines(prev => prev.map(m => m.id === id ? { ...m, quantity: newQuantity } : m));
      }
    } catch (err) {
      console.error('Error updating medicine quantity:', err);
    }
  };

  const deleteMedicine = async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/medicines/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMedicines(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error('Error deleting medicine:', err);
    }
  };

  const deleteDonation = (id: string) => {
    setDonations(prev => prev.filter(d => d.id !== id));
  };

  const deleteAdoption = async (id: string) => {
    try {
      const res = await fetch(`/api/adoptions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAdoptions(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error('Error deleting adoption:', err);
    }
  };

  const deleteAdoptionApplication = (id: string) => {
    setAdoptionApplications(prev => prev.filter(a => a.id !== id));
  };

  const deleteABCRecord = async (id: string) => {
    try {
      const res = await fetch(`/api/abc-records/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAbcRecords(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error('Error deleting ABC record:', err);
    }
  };

  const deleteHousekeepingSupply = async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/housekeeping/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHousekeepingSupplies(prev => prev.filter(h => h.id !== id));
      }
    } catch (err) {
      console.error('Error deleting housekeeping supply:', err);
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/items/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInventoryItems(prev => prev.filter(i => i.id !== id));
      }
    } catch (err) {
      console.error('Error deleting inventory item:', err);
    }
  };

  const deleteMedicineUsage = async (id: string) => {
    try {
      const res = await fetch(`/api/medicine-usages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMedicineUsage(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error('Error deleting medicine usage:', err);
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStaff(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error('Error deleting staff:', err);
    }
  };

  const deleteAnimal = async (id: string) => {
    try {
      const res = await fetch(`/api/animals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAnimals(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error('Error deleting animal:', err);
    }
  };

  const deleteCase = async (id: string) => {
    try {
      const res = await fetch(`/api/cases/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCases(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Error deleting case:', err);
    }
  };

  const deleteClinicalEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/clinical-entries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setClinicalEntries(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Error deleting clinical entry:', err);
    }
  };

  const deleteDeclaration = async (id: string) => {
    try {
      const res = await fetch(`/api/declarations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeclarations(prev => prev.filter(d => d.id !== id));
      }
    } catch (err) {
      console.error('Error deleting declaration:', err);
    }
  };

  const addDonation = async (donation: Donation) => {
    try {
      const { id, ...data } = donation;
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setDonations(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error adding donation:', err);
    }
  };

  const addAdoption = async (adoption: Adoption) => {
    try {
      const { id, ...data } = adoption;
      const res = await fetch('/api/adoptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setAdoptions(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error adding adoption:', err);
    }
  };

  const addAdoptionApplication = async (application: AdoptionApplication) => {
    try {
      const { id, ...data } = application;
      const res = await fetch('/api/adoptions/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setAdoptionApplications(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error adding adoption application:', err);
    }
  };

  const updateAdoptionApplication = (application: AdoptionApplication) => {
    setAdoptionApplications(prev => prev.map(a => a.id === application.id ? application : a));
  };

  const addABCRecord = async (record: ABCRecord) => {
    try {
      const { id, ...data } = record;
      const res = await fetch('/api/abc-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setAbcRecords(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error adding ABC record:', err);
    }
  };

  const updateABCRecord = async (record: ABCRecord) => {
    try {
      const res = await fetch(`/api/abc-records/${record.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      if (res.ok) {
        const saved = await res.json();
        setAbcRecords(prev => prev.map(a => a.id === saved.id ? saved : a));
      }
    } catch (err) {
      console.error('Error updating ABC record:', err);
    }
  };

  const addHousekeepingSupply = async (supply: HousekeepingSupply) => {
    try {
      const { id, ...data } = supply;
      const res = await fetch('/api/inventory/housekeeping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setHousekeepingSupplies(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error adding housekeeping supply:', err);
    }
  };

  const updateHousekeepingSupply = async (supply: HousekeepingSupply) => {
    try {
      const res = await fetch(`/api/inventory/housekeeping/${supply.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supply),
      });
      if (res.ok) {
        const saved = await res.json();
        setHousekeepingSupplies(prev => prev.map(h => h.id === saved.id ? saved : h));
      }
    } catch (err) {
      console.error('Error updating housekeeping supply:', err);
    }
  };

  const addInventoryItem = async (item: InventoryItem) => {
    try {
      const { id, ...data } = item;
      const res = await fetch('/api/inventory/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setInventoryItems(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error adding inventory item:', err);
    }
  };

  const updateInventoryItem = async (item: InventoryItem) => {
    try {
      const res = await fetch(`/api/inventory/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const saved = await res.json();
        setInventoryItems(prev => prev.map(i => i.id === saved.id ? saved : i));
      }
    } catch (err) {
      console.error('Error updating inventory item:', err);
    }
  };

  const addMedicineUsage = async (usage: MedicineUsage) => {
    try {
      const { id, ...data } = usage;
      const res = await fetch('/api/medicine-usages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setMedicineUsage(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error adding medicine usage:', err);
    }
  };

  const addStaff = async (member: StaffMember) => {
    try {
      const { id, ...data } = member;
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const saved = await res.json();
        setStaff(prev => [saved, ...prev]);
      }
    } catch (err) {
      console.error('Error adding staff:', err);
    }
  };

  const updateStaff = async (member: StaffMember) => {
    try {
      const res = await fetch(`/api/staff/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member),
      });
      if (res.ok) {
        const saved = await res.json();
        setStaff(prev => prev.map(s => s.id === saved.id ? saved : s));
      }
    } catch (err) {
      console.error('Error updating staff:', err);
    }
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
