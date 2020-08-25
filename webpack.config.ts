import createExpoWebpackConfigAsync from '@expo/webpack-config';
import { ConfigurationFactory } from 'webpack';

const configFactory: ConfigurationFactory = async (env, args) => {
  const config = await createExpoWebpackConfigAsync(env, args);
  config.resolve.alias = {
    'react-native-linear-gradient': 'react-native-web-linear-gradient',
    'react-native-modals': `${env.projectRoot}/src/components/DesktopModals`,
  };
  config.devServer = {
    headers: { 'Access-Control-Allow-Origin': 'https://api-dev.topicapp.fr' },
  };
  return config;
};

export default configFactory;
