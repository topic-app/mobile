import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View } from 'react-native';
import { Button, Divider, Text, useTheme } from 'react-native-paper';

import { Illustration } from '@components';
import getStyles from '@styles/global';

const WelcomeAppBar: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;
  const navigation = useNavigation();

  return (
    <View style={{ width: '100%', height: '80px', backgroundColor: colors.appBar }}>
      <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
        <View style={{ margin: 10 }}>
          <Illustration name="topic-icon" height={50} width={50} />
        </View>
        <Text style={[styles.title, { fontSize: 30 }]}>Topic</Text>
        <View
          style={[{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 10 }]}
        >
          <Button
            style={{ height: 35, margin: 5 }}
            mode="outlined"
            onPress={() =>
              navigation.navigate('Auth', {
                screen: 'Login',
              })
            }
          >
            Se connecter
          </Button>
          <Button
            style={{ height: 35, margin: 5, marginRight: 10 }}
            mode="contained"
            onPress={() => {
              navigation.navigate('Auth', {
                screen: 'Create',
              });
            }}
          >
            Créer un compte
          </Button>
        </View>
      </View>
      <Divider />
    </View>
  );
};

export default WelcomeAppBar;
