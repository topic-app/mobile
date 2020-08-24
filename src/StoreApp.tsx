import React from 'react';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';
import screens from './screens';

import { Preferences, State } from '@ts/types';
import themes from '@styles/Theme';
import { fetchLocationData } from '@redux/actions/data/location';
import { fetchGroups, fetchAccount } from '@redux/actions/data/account';
import AppNavigator from './index';

type Props = {
  preferences: Preferences;
};

const StoreApp: React.FC<Props> = ({ preferences }) => {
  let theme = themes[preferences.theme] || 'light';

  const colorScheme = useColorScheme();

  if (preferences.useSystemTheme) {
    theme = themes[colorScheme === 'dark' ? 'dark' : 'light'];
  }

  React.useEffect(
    React.useCallback(() => {
      fetchLocationData().catch((e) => console.log(`fetchLocationData err ${e}`));
      fetchGroups().catch((e) => console.log(`fetchGroups err ${e}`));
      fetchAccount().catch((e) => console.log(`fetchAccount err ${e}`));
    }, [null]),
  );

  const linking = {
    prefixes: ['https://topicapp.fr', 'https://beta.topicapp.fr', 'topic://'],
    config: {
      screens,
    },
  };

  return (
    <PaperProvider theme={theme}>
      <>
        <NavigationContainer linking={linking} fallback={<Text>App loading...</Text>}>
          <AppNavigator />
        </NavigationContainer>
      </>
    </PaperProvider>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return { preferences };
};

export default connect(mapStateToProps)(StoreApp);
