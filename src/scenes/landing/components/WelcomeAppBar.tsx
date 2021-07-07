import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Button, Divider, IconButton, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { Illustration } from '@components';
import getStyles from '@styles/global';
import { State, Account } from '@ts/types';

type props = {
  account: Account;
};

const WelcomeAppBar: React.FC<props> = ({ account }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  return (
    <View style={{ width: '100%', height: '80px', backgroundColor: colors.appBar }}>
      <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
        <View style={{ margin: 10 }}>
          <Illustration name="topic-icon" height={50} width={50} />
        </View>
        <Text style={[styles.title, { fontSize: 30 }]}>Topic</Text>
        {account.loggedIn ? (
          <View
            style={[{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 10 }]}
          >
            <Button
              style={{ height: 35, margin: 5 }}
              mode="text"
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
              @{account.accountInfo.user?.info?.username}
            </Button>
          </View>
        ) : width > 1200 ? (
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
        ) : (
          <View
            style={[{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 10 }]}
          >
            <IconButton
              style={{ height: 35, margin: 5 }}
              color={colors.primary}
              icon="account"
              onPress={() =>
                navigation.navigate('Auth', {
                  screen: 'Login',
                })
              }
            >
              Se connecter
            </IconButton>
            <IconButton
              icon="account-plus"
              color={colors.primary}
              style={{ height: 35, margin: 5, marginRight: 10 }}
              onPress={() => {
                navigation.navigate('Auth', {
                  screen: 'Create',
                });
              }}
            >
              Créer un compte
            </IconButton>
          </View>
        )}
      </View>
      <Divider />
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { account };
};

export default connect(mapStateToProps)(WelcomeAppBar);
