import React from 'react';
import { View } from 'react-native';
import { Text, Card, Paragraph, Title, Caption, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { EventVerificationPreload, State, Preferences, AnyEvent } from '@ts/types';
import { Format } from '@utils';
import { NativeStackNavigationProp } from '@utils/compat/stack';

import { CardBase } from '../Cards';
import CustomImage from '../CustomImage';
import TagList from '../TagList';
import getCardStyles from './styles/CardStyles';

const EVENT_CARD_HEIGHT = 297; // IMPORTANT: This should be updated every time something is changed (used for getItemLayout optimization)

type EventCardProps = {
  event: AnyEvent;
  navigate: NativeStackNavigationProp<any, any>['navigate'];
  verification?: boolean;
  unread?: boolean;
  preferences: Preferences;
  overrideImageWidth?: number;
};

const EventCard: React.FC<EventCardProps> = ({
  event,
  navigate,
  verification,
  preferences,
  unread = true,
  overrideImageWidth = 140,
}) => {
  const eventVerification = event as EventVerificationPreload;

  const theme = useTheme();
  const { colors } = theme;
  const cardStyles = getCardStyles(theme);

  if (!event) {
    return (
      <CardBase>
        <Card.Content>
          <Text>Évènement non existant</Text>
        </Card.Content>
      </CardBase>
    );
  }

  const verificationColors = ['green', 'yellow', 'yellow', 'orange', 'orange', 'orange'];

  const readStyle = !unread && { color: colors.disabled };

  return (
    <CardBase onPress={navigate} contentContainerStyle={{ paddingTop: 0, paddingBottom: 0 }}>
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
          <View style={{ flex: 1 }}>
            <Title numberOfLines={2} style={[readStyle]}>
              {event?.title}
            </Title>
            <Caption>
              {Format.shortEventDate(event.duration)} ·{' '}
              <Icon name="eye" color={colors.subtext} size={12} />{' '}
              {typeof event.cache?.views === 'number' ? event.cache.views : '?'} ·{' '}
              <Icon name="thumb-up" color={colors.subtext} size={12} />{' '}
              {typeof event.cache?.likes === 'number' ? event.cache.likes : '?'}
            </Caption>
          </View>
          {verification && eventVerification?.verification && (
            <View
              style={{
                borderRadius: 20,
                backgroundColor:
                  verificationColors[eventVerification?.verification?.bot?.score] || 'red',
                height: 40,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 20, color: 'black' }}>
                {eventVerification?.verification?.bot?.score}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
      <View style={{ paddingVertical: 5 }}>
        <TagList item={event} scrollable={false} />
      </View>
      <Card.Content style={{ marginTop: 5, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          {event.image?.image ? (
            <CustomImage
              image={event?.image}
              imageSize="medium"
              width={overrideImageWidth}
              height={overrideImageWidth}
            />
          ) : null}
          <View
            style={{
              marginLeft: event.image?.image ? 15 : 0,
              flex: 1,
              maxHeight: overrideImageWidth,
            }}
          >
            <Paragraph
              numberOfLines={4}
              style={[
                {
                  fontFamily:
                    preferences.fontFamily !== 'system' ? preferences.fontFamily : undefined,
                },
              ]}
            >
              {event?.summary}
            </Paragraph>
            {Array.isArray(event?.places) &&
              event.places.map((p) => (
                <View
                  key={p._id}
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}
                >
                  <Icon
                    color={colors.icon}
                    name={p.type === 'online' ? 'link' : 'map-marker'}
                    style={cardStyles.cardDescription}
                  />
                  <Text
                    style={[cardStyles.cardDescription, { flex: 1, paddingLeft: 4 }]}
                    numberOfLines={1}
                  >
                    {p.type === 'standalone' && Format.address(p.address)}
                    {p.type === 'school' && p.associatedSchool?.displayName}
                    {p.type === 'place' && p.associatedPlace?.displayName}
                    {p.type === 'online' &&
                      p.link?.replace('http://', '')?.replace('https://', '')?.split(/[/?#]/)?.[0]}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </Card.Content>
      {verification && (
        <Card.Content>
          {eventVerification.verification?.bot?.flags?.length !== 0 && (
            <View style={{ flexDirection: 'row' }}>
              <Icon
                accessibilityRole="none"
                name="tag"
                color={colors.invalid}
                size={16}
                style={{ alignSelf: 'center', marginRight: 5 }}
              />
              <Text>Classifié comme {eventVerification.verification?.bot?.flags?.join(', ')}</Text>
            </View>
          )}
          {eventVerification.verification?.reports?.length !== 0 && (
            <View style={{ flexDirection: 'row' }}>
              <Icon
                accessibilityRole="none"
                name="message-alert"
                color={colors.invalid}
                size={16}
                style={{ alignSelf: 'center', marginRight: 5 }}
              />
              <Text>Signalé {eventVerification.verification?.reports?.length} fois</Text>
            </View>
          )}
          {eventVerification.verification?.users?.length !== 0 &&
            !eventVerification.verification?.verified && (
              <View style={{ flexDirection: 'row' }}>
                <Icon
                  accessibilityRole="none"
                  name="shield"
                  color={colors.invalid}
                  size={16}
                  style={{ alignSelf: 'center', marginRight: 5 }}
                />
                <Text>Remis en moderation</Text>
              </View>
            )}
          {eventVerification.verification?.extraVerification && (
            <View style={{ flexDirection: 'row' }}>
              <Icon
                accessibilityRole="none"
                name="alert-decagram"
                color={colors.invalid}
                size={16}
                style={{ alignSelf: 'center', marginRight: 5 }}
              />
              <Text>Vérification d&apos;un administrateur Topic requise</Text>
            </View>
          )}
        </Card.Content>
      )}
    </CardBase>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return {
    preferences,
  };
};

export { EVENT_CARD_HEIGHT };

export default connect(mapStateToProps)(EventCard);
