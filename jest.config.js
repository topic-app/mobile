// Note: Do not convert to .config.ts, Jest will no longer work!

module.exports = {
  preset: 'jest-expo',
  // By default Jest doesn't transform node_modules, because they should be valid JavaScript files.
  // However, it happens that library authors assume that you'll compile their sources, and they
  // might leave their code in TS files.
  // So you have to tell Jest explicitly that these packages should be compiled.
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native' +
      '|unimodules-permissions-interface' +
      '|react-clone-referenced-element' +
      '|@react-native-community' +
      '|expo(nent)?' +
      '|@expo(nent)?/.*' +
      '|@expo-google-fonts/.*' +
      '|react-navigation' +
      '|@react-navigation/.*' +
      '|@unimodules/.*' +
      '|sentry-expo' +
      ')',
  ],
  globals: {
    __DEV__: true,
  },
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['<rootDir>/tests/mocks/setup-tests.js', '<rootDir>/tests/mocks/'],
  setupFiles: ['<rootDir>/tests/mocks/setup-tests.js'],
};
