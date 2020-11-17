import React from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import { useTheme, getImageUrl } from '@utils/index';
import getStyles from '@styles/Styles';
import { TranslucentStatusBar, PlatformBackButton, SafeAreaView } from '@components/index';
import AutoHeightImage from 'react-native-auto-height-image';

function ImageDisplay({ navigation, route }) {
  const { image } = route.params;
  const theme = useTheme();
  const styles = getStyles(theme);
  return (
    <View
      style={{
        backgroundColor: '#000000',
        height: Dimensions.get('screen').height,
        flex: 1,
        flexGrow: 1,
        alignContent: 'center',
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <PlatformBackButton onPress={navigation.goBack} />
        <AutoHeightImage
          source={{ uri: getImageUrl({ image, size: 'full' }) || '' }}
          width={Dimensions.get('window').width}
        />
      </SafeAreaView>
    </View>
  );
}

export default ImageDisplay;
