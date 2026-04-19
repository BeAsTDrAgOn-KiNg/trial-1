export const GoogleGenAI = jest.fn().mockImplementation(() => ({
  getGenerativeModel: jest.fn().mockReturnValue({
    generateContent: jest.fn().mockResolvedValue({
      response: {
        text: () => 'Mocked AI Response',
      },
    }),
  }),
}));

export const Type = {
  OBJECT: 'OBJECT',
  STRING: 'STRING',
  // Add other types if necessary
};
