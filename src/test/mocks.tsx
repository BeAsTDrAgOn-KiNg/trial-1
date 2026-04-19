import React from 'react';

export const mockAppContext = {
  animals: [],
  cases: [],
  clinicalEntries: [],
  wildlifeCases: [],
  declarations: [],
  medicines: [],
  donations: [],
  adoptions: [],
  adoptionApplications: [],
  abcRecords: [],
  housekeepingSupplies: [],
  inventoryItems: [],
  medicineUsage: [],
  staff: [],
  userProfiles: [],
  lowStockMedicines: [],
  isLoading: false,
  addAnimal: jest.fn(),
  updateAnimal: jest.fn(),
  addCase: jest.fn(),
  updateCase: jest.fn(),
  addClinicalEntry: jest.fn(),
  addWildlifeCase: jest.fn(),
  addDeclaration: jest.fn(),
  updateDeclaration: jest.fn(),
  addMedicine: jest.fn(),
  updateMedicineQuantity: jest.fn(),
  deleteMedicine: jest.fn(),
  deleteDonation: jest.fn(),
  deleteAdoption: jest.fn(),
  deleteAdoptionApplication: jest.fn(),
  deleteABCRecord: jest.fn(),
  deleteHousekeepingSupply: jest.fn(),
  deleteInventoryItem: jest.fn(),
  deleteMedicineUsage: jest.fn(),
  deleteStaff: jest.fn(),
  deleteAnimal: jest.fn(),
  deleteCase: jest.fn(),
  deleteClinicalEntry: jest.fn(),
  deleteDeclaration: jest.fn(),
  addDonation: jest.fn(),
  addAdoption: jest.fn(),
  addAdoptionApplication: jest.fn(),
  updateAdoptionApplication: jest.fn(),
  addABCRecord: jest.fn(),
  updateABCRecord: jest.fn(),
  addHousekeepingSupply: jest.fn(),
  updateHousekeepingSupply: jest.fn(),
  addInventoryItem: jest.fn(),
  updateInventoryItem: jest.fn(),
  addMedicineUsage: jest.fn(),
  addStaff: jest.fn(),
  updateStaff: jest.fn(),
};

export const mockNotificationContext = {
  notify: jest.fn(),
};

// Mocking the hooks
jest.mock('../context/AppContext', () => ({
  useAppContext: () => mockAppContext,
  AppProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../context/NotificationContext', () => ({
  useNotification: () => mockNotificationContext,
  NotificationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({ response: { text: () => 'Mocked text' } }),
    }),
  })),
  Type: {},
}));
