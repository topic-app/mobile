module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@root': '.',
          '@src': './src',
          '@components': './src/components',
          '@assets': './src/assets',
          '@redux': './src/redux',
          '@styles': './src/styles',
          '@utils': './src/utils',
        },
        extensions: [
          '.js',
          '.android.js',
          '.ios.js',
          '.native.js',
          '.jsx',
          '.android.jsx',
          '.ios.jsx',
          '.ts',
          '.tsx',
          '.ios.tsx',
          '.android.tsx',
        ],
      },
    ],
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
