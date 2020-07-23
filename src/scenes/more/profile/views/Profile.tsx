import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, useTheme, Title, Subheading, Divider } from 'react-native-paper';
import { connect } from 'react-redux';
import Avatar from '@components/Avatar';
import getStyles from '@styles/Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TranslucentStatusBar } from '@root/src/components/Header.ios';
import { InlineCard } from '@components/Cards';

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
        official: true,
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
          schools: [
            {
              _id: '5e9208118851c52a8e6c6f8d',
              displayName: 'CIV',
              address: {
                address: {
                  number: '3',
                  street: 'chemin de chose',
                  city: 'Valbonne',
                  code: '3533',
                },
              },
            },
          ],
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

function getAddressString(address) {
  const { number, street, city, code } = address || {};
  if (number && street && city && code) {
    return `${number} ${street}, ${code} ${city}`;
  }
  if (city) return city;
  return null;
}

function genName({ data, info }) {
  if (data.firstName && data.lastName) {
    return `${data.firstName} ${data.lastName}`;
  }
  return data.firstName || data.lastName || info.username;
}

function Profile() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;
  return (
    <View style={styles.page}>
      <ScrollView>
        <View style={[styles.contentContainer, { marginTop: 20, flexDirection: 'row' }]}>
          <View>
            <Avatar avatar={account.accountInfo.user.info.avatar} />
          </View>
          <View style={[styles.centerIllustrationContainer, { flexDirection: 'row' }]}>
            {account.accountInfo.user.data.public ? (
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Title>{genName(account.accountInfo.user)}</Title>
                  <View style={{ marginLeft: 5 }}>
                    {account.accountInfo.user.info.official && (
                      <Icon name="check-decagram" color={colors.primary} size={20} />
                    )}
                  </View>
                </View>
                <Subheading style={{ marginTop: -10 }}>
                  @{account.accountInfo.user.info.username}
                </Subheading>
              </View>
            ) : (
              <Title>@{account.accountInfo.user.info.username}</Title>
            )}
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Text>{account.accountInfo.user.data.cache.followers}</Text>
          </View>
          <View>
            <Text>
              {account.accountInfo.user.data.following.groups.length +
                account.accountInfo.user.data.following.users.length +
                account.accountInfo.user.data.following.events.length}
            </Text>
          </View>
        </View>
        <View>
          {account.accountInfo.user.data.location.global && (
            <InlineCard
              icon="map-marker"
              title="France Entière"
              onPress={() => console.log('global pressed')}
            />
          )}
          {account.accountInfo.user.data.location.schools?.map((school) => (
            <InlineCard
              key={school._id}
              icon="school"
              title={school.displayName}
              subtitle={getAddressString(school.address.address) || school.shortName}
              onPress={() => console.log(`school ${school._id} pressed!`)}
            />
          ))}
          {account.accountInfo.user.data.location.departments?.map((dep) => (
            <InlineCard
              key={dep._id}
              icon="domain"
              title={dep.displayName}
              subtitle="Département"
              onPress={() => console.log(`department ${dep._id} pressed!`)}
            />
          ))}
        </View>

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
