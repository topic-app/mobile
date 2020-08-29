const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.resolve.alias = {
    'react-native-linear-gradient': 'react-native-web-linear-gradient',
  };
  config.devServer = {
    headers: { 'Access-Control-Allow-Origin': 'https://api-dev.topicapp.fr' },
  };
  return config;
};
