import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import React from 'react';
import { View, Dimensions } from 'react-native';
import { Card, Paragraph, Text, Title, Caption } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { ArticlePreload, ArticleVerificationPreload, State, Preferences, Article } from '@ts/types';
import { useTheme } from '@utils/index';

import { CardBase } from '../Cards';
import CustomImage from '../CustomImage';
import TagList from '../TagList';

type ArticleCardProps = {
  verification?: boolean;
  article: ArticleVerificationPreload | ArticlePreload | Article;
  navigate: StackNavigationProp<any, any>['navigate'];
  unread?: boolean;
  preferences: Preferences;
  overrideImageWidth?: number;
};

const ARTICLE_CARD_HEADER_HEIGHT = 145; // IMPORTANT: This should be updated every time something is changed (used for getItemLayout optimization)

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  navigate,
  unread = true,
  preferences,
  verification = false,
  overrideImageWidth,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  const [cardWidth, setCardWidth] = React.useState(600);
  const imageSize = cardWidth / 3.5;

  if (!article) {
    return (
      <CardBase>
        <Card.Content>
          <Text>Article non existant</Text>
        </Card.Content>
      </CardBase>
    );
  }

  // TODO: Find a better way than this
  const articleVerification = article as ArticleVerificationPreload;

  const readStyle = !unread && { color: colors.disabled };

  const verificationColors = ['green', 'yellow', 'yellow', 'orange', 'orange', 'orange'];

  return (
    <View
      onLayout={({
        nativeEvent: {
          layout: { width, height },
        },
      }) => {
        setCardWidth(width);
      }}
    >
      <CardBase onPress={navigate}>
        <Card.Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Title numberOfLines={2} style={readStyle}>
                {article.title}
              </Title>
              <Caption>{`Publié ${moment(article.date).fromNow()}`}</Caption>
            </View>
            {verification && articleVerification.verification && (
              <View
                style={{
                  borderRadius: 20,
                  backgroundColor:
                    verificationColors[articleVerification.verification?.bot?.score] || 'red',
                  height: 40,
                  width: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 20, color: 'black' }}>
                  {articleVerification.verification?.bot?.score}
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
        <TagList item={article} scrollable={false} />
        <Card.Content>
          <View style={{ flexDirection: 'row', paddingTop: 6 }}>
            <CustomImage
              image={article.image}
              imageSize="medium"
              width={overrideImageWidth || imageSize}
              height={overrideImageWidth || imageSize}
            />
            <View
              style={{
                marginLeft: 15,
                flex: 1,
              }}
            >
              <Paragraph
                numberOfLines={6}
                style={[readStyle, { fontFamily: preferences.fontFamily }]}
              >
                {article.summary}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
        {verification && (
          <Card.Content>
            {articleVerification.verification?.bot?.flags?.length !== 0 && (
              <View style={{ flexDirection: 'row' }}>
                <Icon
                  name="tag"
                  color={colors.invalid}
                  size={16}
                  style={{ alignSelf: 'center', marginRight: 5 }}
                />
                <Text>
                  Classifié comme {articleVerification.verification?.bot?.flags?.join(', ')}
                </Text>
              </View>
            )}
            {articleVerification.verification?.reports?.length !== 0 && (
              <View style={{ flexDirection: 'row' }}>
                <Icon
                  name="message-alert"
                  color={colors.invalid}
                  size={16}
                  style={{ alignSelf: 'center', marginRight: 5 }}
                />
                <Text>Reporté {articleVerification.verification?.reports?.length} fois</Text>
              </View>
            )}
            {articleVerification.verification?.users?.length !== 0 && (
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
            {articleVerification.verification?.extraVerification && (
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

export { ARTICLE_CARD_HEADER_HEIGHT };

export default connect(mapStateToProps)(ArticleCard);
