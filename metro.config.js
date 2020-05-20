/* eslint-disable */
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    transformer: {
      // Allows wrapping of react-native-svg's component around an import statement as such:

      // import TopicIcon from '@assets/images/topic-icon.svg'
      // ...
      // return <TopicIcon />

      // Read more: https://github.com/react-native-community/react-native-svg#use-with-svg-files

      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'jsx', 'svg'],
    },
  };
})();
