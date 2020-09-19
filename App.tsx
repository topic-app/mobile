import React from 'react';
import 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import { View, Platform, Text } from 'react-native';
import {
  useFonts,
  Rubik_300Light,
  Rubik_300Light_Italic,
  Rubik_500Medium,
  Rubik_500Medium_Italic,
  Rubik_700Bold,
  Rubik_700Bold_Italic,
} from '@expo-google-fonts/rubik';
import { Roboto_400Regular, Roboto_400Regular_Italic } from '@expo-google-fonts/roboto';
import { RobotoSlab_400Regular } from '@expo-google-fonts/roboto-slab';
import {
  RobotoMono_400Regular,
  RobotoMono_400Regular_Italic,
} from '@expo-google-fonts/roboto-mono';
import 'moment/locale/fr';

import { enableScreens } from 'react-native-screens';
import Store, { Persistor } from '@redux/store';

import StoreApp from './src/StoreApp';
import errorHandler from './ErrorHandler';
import { AppLoading } from 'expo';
import { PersistGate } from 'redux-persist/integration/react';

enableScreens();

if (Platform.OS !== 'web') {
  setJSExceptionHandler(errorHandler);
}

function App() {
  const [fontsLoaded] = useFonts({
    Roboto: Roboto_400Regular,
    Roboto_Italic: Roboto_400Regular_Italic,
    'Rubik-Light': Rubik_300Light,
    'Rubik-Light_Italic': Rubik_300Light_Italic,
    'Rubik-Medium': Rubik_500Medium,
    'Rubik-Medium_Italic': Rubik_500Medium_Italic,
    'Rubik-Bold': Rubik_700Bold,
    'Rubik-Bold_Italic': Rubik_700Bold_Italic,
    'Roboto-Slab': RobotoSlab_400Regular,
    'Roboto-Slab_Italic': Roboto_400Regular_Italic,
    'Roboto-Mono': RobotoMono_400Regular,
    'Roboto-Mono_Italic': RobotoMono_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ReduxProvider store={Store}>
      <PersistGate persistor={Persistor} loading={<AppLoading />}>
        <StoreApp />
      </PersistGate>
    </ReduxProvider>
  );
}

export default App;
