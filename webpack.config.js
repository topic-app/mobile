const createExpoWebpackConfigAsync = require('@expo/webpack-config');
// eslint-disable-next-line import/no-extraneous-dependencies
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.resolve.alias = {
    'react-native': 'react-native-web',
    'react-native-linear-gradient': 'react-native-web-linear-gradient',
  };
  config.devServer = {
    headers: { 'Access-Control-Allow-Origin': 'https://api.topicapp.fr' },
    historyApiFallback: {
      index: 'index.html',
    },
    disableHostCheck: true,
  };

  // if (config.mode === 'development') {
  //   config.plugins.push(
  //     new CopyWebpackPlugin({
  //       patterns: [{ from: 'web', context: __dirname }],
  //     }),
  //   );
  // }

  // Remove existing rules about svg and inject our own
  // From https://github.com/expo/expo/issues/6660#issuecomment-573506912
  config.module.rules = config.module.rules.map((rule) => {
    if (rule.oneOf) {
      let hasModified = false;

      const newRule = {
        ...rule,
        oneOf: rule.oneOf.map((oneOfRule) => {
          if (oneOfRule.test && oneOfRule.test.toString().includes('svg')) {
            hasModified = true;
            const test = oneOfRule.test.toString().replace('|svg', '');
            return { ...oneOfRule, test: new RegExp(test) };
          } else {
            return oneOfRule;
          }
        }),
      };

      // Add new rule to use svgr
      // Place at the beginning so that the default loader doesn't catch it
      if (hasModified) {
        newRule.oneOf.unshift({
          test: /\.svg$/,
          exclude: /node_modules/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                svgoConfig: {
                  plugins: {
                    removeViewBox: false,
                  },
                },
              },
            },
          ],
        });
      }

      return newRule;
    } else {
      return rule;
    }
  });

  return config;
};
