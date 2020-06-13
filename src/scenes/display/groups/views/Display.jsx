import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Platform, TouchableOpacity } from 'react-native';
import { Button, Text, Paragraph, useTheme, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Avatar from '@components/Avatar';
import { CategoryTitle } from '@components/Typography';
import { InlineCard } from '@components/Cards';
import testGroupData from '@src/data/groupListData.json';
import getStyles from '@styles/Styles';

function getAddressString(address) {
  const { number, street, city, code } = address || {};
  if (number && street && city && code) {
    return `${number} ${street}, ${code} ${city}`;
  }
  if (city) return city;
  return null;
}

function GroupDisplay({ route, navigation }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const { id } = route.params;
  const group = testGroupData.find((g) => g._id === id);

  const [following, setFollowing] = React.useState(group.userInfo.isFollowing);

  const toggleFollow = () => setFollowing(!following); // TODO: Hook up to state & server

  // Only displays first four members
  const groupMembers = group.members?.slice(0, 4).sort((a, b) => a.position - b.position);
  const remainingMembers = group.cache.members - groupMembers.length;

  return (
    <View style={styles.page}>
      <ScrollView>
        <View style={{ elevation: 3, backgroundColor: colors.surface }}>
          <View style={{ padding: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar name={group.name} imageUrl={group.imageUrl} style={styles.avatar} />
              <View style={{ paddingLeft: 15, flex: 1 }}>
                <Text style={{ fontSize: 22 }} numberOfLines={2}>
                  {`${group.name} `}
                  {group.verified && <Icon name="check-decagram" size={20} color={colors.icon} />}
                </Text>
                <Text style={{ paddingLeft: 2, color: colors.muted }}>
                  {group.cache.members} membres &#xFF65; {group.cache.followers} abonnés
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 5 }}>
              {group.userInfo.isMember && (
                <Button
                  mode="outlined"
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                  onPress={() => console.log('Leave group')}
                >
                  Quitter
                </Button>
              )}
              <Button
                mode={following ? 'outlined' : 'contained'}
                style={{
                  backgroundColor: following ? colors.surface : colors.primary,
                  borderRadius: 20,
                }}
                onPress={toggleFollow}
              >
                {following ? 'Abonné' : "S'abonner"}
              </Button>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <CategoryTitle>Description</CategoryTitle>
          <Paragraph numberOfLines={5}>{group.summary}</Paragraph>
          {group.description?.data && (
            // Only show 'Read more' if there is a description
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity
                activeOpacity={Platform.OS === 'ios' ? 0.2 : 0.6}
                onPress={() =>
                  navigation.navigate('Description', { title: group.name, id: group._id })
                }
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: colors.disabled, alignSelf: 'center' }}>
                    Voir la description complète
                  </Text>
                  <Icon name="chevron-right" color={colors.disabled} size={23} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Divider />
        {group.location.global && (
          <InlineCard
            icon="map-marker"
            title="France Entière"
            onPress={() => console.log('global pressed')}
          />
        )}
        {group.location.schools?.map((school) => (
          <InlineCard
            key={school._id}
            icon="school"
            title={school.displayName}
            subtitle={getAddressString(school.address.address) || school.shortName}
            onPress={() => console.log(`school ${school._id} pressed!`)}
          />
        ))}
        {group.location.departments?.map((dep) => (
          <InlineCard
            key={dep._id}
            icon="domain"
            title={dep.displayName}
            subtitle="Département"
            onPress={() => console.log(`department ${dep._id} pressed!`)}
          />
        ))}
        <Divider />
        <View style={styles.container}>
          <CategoryTitle>Membres</CategoryTitle>
        </View>
        {groupMembers.map((mem) => (
          <InlineCard
            key={mem._id}
            title={mem.displayName}
            subtitle={mem.role.name}
            badge={mem.role.admin ? 'star' : null}
            badgeColor={colors.solid.gold}
            icon="account"
            onPress={() => console.log(`user ${mem._id} pressed!`)}
          />
        ))}
        {remainingMembers > 0 && (
          <InlineCard
            title={`Et ${remainingMembers} autres...`}
            onPress={() => console.log(`see complete member list`)}
          />
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

export default GroupDisplay;

GroupDisplay.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
