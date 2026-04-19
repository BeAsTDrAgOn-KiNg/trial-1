import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  forceExit: true,
  projects: [
    {
      displayName: 'server',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/tests/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/server/tests/setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
    {
      displayName: 'client',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
      transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\](?!(@google\\/genai|lucide-react|p-retry|@radix-ui)).+\\.(js|jsx|mjs|ts|tsx)$',
      ],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@google/genai$': '<rootDir>/src/test/genaiMock.ts',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
    },
  ],
};

export default config;
