import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, Paragraph, Title, Card, useTheme } from 'react-native-paper';
import { PlatformTouchable } from '@components/PlatformComponents';
import Avatar from '@components/Avatar';
import getStyles from '@styles/Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function MyGroupsListCard({ group, navigate, member, following }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <Card style={styles.card}>
      <PlatformTouchable onPress={navigate}>
        <View>
          <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
              <Avatar name={group.name} imageUrl={group.imageUrl} style={styles.avatar} />
              <View style={{ flex: 1, paddingLeft: 15 }}>
                <View>
                  <Title style={{ flex: 1 }} numberOfLines={1}>
                    {group.name}
                  </Title>
                </View>
                <Paragraph style={{ fontSize: 15 }}>
                  <Text style={{ fontSize: 16 }}>{group.cache?.members}</Text> membres &#xFF65;{' '}
                  <Text style={{ fontSize: 16 }}>{group.cache?.followers}</Text> abonnés
                </Paragraph>
              </View>
              <View>
                {following && <Icon name="star-circle" color={colors.primary} size={32} />}
                {member && <Icon name="account-outline" color={colors.primary} size={32} />}
              </View>
            </View>
            <Paragraph numberOfLines={3} style={{ paddingTop: 7, paddingHorizontal: 5 }}>
              {group.summary}
            </Paragraph>
          </View>
        </View>
      </PlatformTouchable>
    </Card>
  );
}

export default MyGroupsListCard;

MyGroupsListCard.propTypes = {
  group: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    description: PropTypes.shape({
      parser: PropTypes.oneOf(['plaintext', 'markdown']),
      data: PropTypes.string,
    }),
    location: PropTypes.shape({
      global: PropTypes.bool,
      schools: PropTypes.arrayOf(PropTypes.object),
      departments: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    cache: PropTypes.shape({
      followers: PropTypes.number.isRequired,
      members: PropTypes.number.isRequired,
    }),
    userInfo: PropTypes.shape({
      isMember: PropTypes.bool.isRequired,
      isFollowing: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
};
