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

const EVENT_CARD_HEADER_HEIGHT = 157; // IMPORTANT: This should be updated every time something is changed (used for getItemLayout optimization)

type EventCardProps = {
  event: AnyEvent;
  navigate: NativeStackNavigationProp<any, any>['navigate'];
  verification?: boolean;
  preferences: Preferences;
  overrideImageWidth?: number;
};

const EventCard: React.FC<EventCardProps> = ({
  event,
  navigate,
  verification,
  preferences,
  overrideImageWidth,
}) => {
  const [cardWidth, setCardWidth] = React.useState(600);
  let imageSize = overrideImageWidth || cardWidth / 3.5;
  if (imageSize > 250) {
    imageSize = 250;
  }

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

  return (
    <View
      onLayout={({
        nativeEvent: {
          layout: { width },
        },
      }) => {
        setCardWidth(width);
      }}
    >
      <CardBase onPress={navigate} contentContainerStyle={{ paddingTop: 0, paddingBottom: 0 }}>
        <Card.Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
            <View style={{ flex: 1 }}>
              <Title numberOfLines={2}>{event?.title}</Title>
              <Caption>{Format.shortEventDate(event.duration)}</Caption>
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
                width={imageSize}
                height={imageSize}
              />
            ) : null}
            <View
              style={{
                marginLeft: event.image?.image ? 15 : 0,
                flex: 1,
                maxHeight: imageSize,
              }}
            >
              <Paragraph numberOfLines={4} style={[{ fontFamily: preferences.fontFamily }]}>
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
                        p.link
                          ?.replace('http://', '')
                          ?.replace('https://', '')
                          ?.split(/[/?#]/)?.[0]}
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
                  name="tag"
                  color={colors.invalid}
                  size={16}
                  style={{ alignSelf: 'center', marginRight: 5 }}
                />
                <Text>
                  Classifié comme {eventVerification.verification?.bot?.flags?.join(', ')}
                </Text>
              </View>
            )}
            {eventVerification.verification?.reports?.length !== 0 && (
              <View style={{ flexDirection: 'row' }}>
                <Icon
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
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return {
    preferences,
  };
};

export { EVENT_CARD_HEADER_HEIGHT };

export default connect(mapStateToProps)(EventCard);
