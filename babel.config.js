module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
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
            '@redux': './src/redux',
            '@utils': './src/utils',
            '@constants': './src/constants',
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
};
