const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.resolve.alias["react-native-linear-gradient"] =
    "react-native-web-linear-gradient";
  console.log(env);
  config.resolve.alias[
    "react-native-modals"
  ] = `${env.projectRoot}/src/components/DesktopModals`;
  // Customize the config before returning it.
  return config;
};
