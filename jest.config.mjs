export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/infrastructure/**/*.{ts,tsx}',
    'src/use-case/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  testMatch: [
    '**/src/__tests__/infrastructure/supabase/repositories/JobRepository.test.ts',
    '**/src/__tests__/use-case/jobs/GetJobById.test.ts',
    '**/src/__tests__/use-case/auth/SignIn.test.ts'
  ],
}; 