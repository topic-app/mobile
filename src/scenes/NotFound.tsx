import React from 'react';
import { View } from 'react-native';
import { Text, Title, Button, useTheme } from 'react-native-paper';

import { Illustration } from '@components';
import getStyles from '@styles/global';

import { MainScreenNavigationProp } from './Main';

type Props = {
  navigation: MainScreenNavigationProp<'NotFound'>;
};

const NotFound: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;
  return (
    <View style={styles.centerIllustrationContainer}>
      <Illustration name="search" height="200" width="200" />
      <Title style={styles.title}>Page inexistante</Title>
      <Text style={{ color: colors.disabled, marginTop: 10 }}>Erreur 404</Text>
      <View style={{ marginTop: 30 }}>
        <Button
          mode="outlined"
          uppercase={false}
          onPress={() =>
            navigation.navigate('Root', {
              screen: 'Main',
              params: {
                screen: 'Home1',
                params: { screen: 'Home2', params: { screen: 'Article' } },
              },
            })
          }
        >
          Retour à la page d'acceuil
        </Button>
      </View>
      {navigation.canGoBack() ? (
        <View style={{ marginTop: 30 }}>
          <Button mode="outlined" uppercase={false} onPress={() => navigation.goBack()}>
            Retour à la page précédente
          </Button>
        </View>
      ) : null}
    </View>
  );
};

export default NotFound;
