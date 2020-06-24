import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import getStyles from '@styles/Styles';

const account = {
  loggedIn: true,
  accountInfo: {
    accountId: '123456789012345',
    accountToken: 'abcdefghijklmnop',
    accountTokenExpiry: '2020-07-01T07:33:19.346Z',
    user: {
      verification: { verified: true },
      types: ['user'],
      info: {
        // Cannot be modified by user
        // This is all public
        username: 'Username',
        // image: { type: Image, default: defaults.image },
        joinDate: '2020-05-01T07:33:19.346Z',
        avatar: {
          type: 'gradient',
          text: 'U',
          color: '#000000',
          gradient: {
            start: '#000000',
            end: '#000000',
            angle: 23,
          },
        },
        official: false,
      },
      data: {
        // This data can only be shown if public is true, and can be directly modified by user
        public: true,
        firstName: 'Utilisateur', // Optionnel
        lastName: 'Test', // Optionnel
        following: {
          groups: [
            {
              _id: '912999193919293919',
              displayName: 'Robotique CIV',
              image: {
                image: '9932939292993',
                thumbnails: {
                  small: true,
                },
              },
            },
          ],
          users: [
            {
              _id: '03939299329493293',
              displayName: 'Hello',
              avatar: {
                type: 'gradient',
              },
            },
          ],
          events: [],
        },
        location: {
          schools: ['5e9208118851c52a8e6c6f8d'],
          departments: [],
          global: false,
        },
        description: 'Bonjour bonjour',
        cache: {
          followers: 103, // Le nombre de personnes qui suivent l'utilisateur
        },
      },
      sensitiveData: {
        // This is never shown to anyone
        email: 'test@example.org',
      },
    },
  },
};

function Profile() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;
  return (
    <View style={styles.page}>
      <ScrollView>
        <Text>Profile!</Text>
        <Text>{JSON.stringify(account, null, 2)}</Text>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { account, groups } = state;
  return {
    account,
    groups,
  };
};

export default connect(mapStateToProps)(Profile);
