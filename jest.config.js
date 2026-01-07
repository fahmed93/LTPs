module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '@react-native-async-storage/async-storage':
      '<rootDir>/__tests__/__mocks__/@react-native-async-storage/async-storage.js',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/__mocks__/',
  ],
};
