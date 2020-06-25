module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        // Note: if you change aliases, don't forget to reflect them in tsconfig.json
        alias: {
          '@root': '.',
          '@src': './src',
          '@components': './src/components',
          '@assets': './src/assets',
          '@styles': './src/styles',
          '@redux': './common/redux',
          '@utils': './common/utils',
          '@ts': './src/ts',
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
