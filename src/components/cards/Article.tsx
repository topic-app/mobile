import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import { Card, Paragraph, Text, Title, Caption, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { ArticlePreload, ArticleVerificationPreload, State, Preferences, Article } from '@ts/types';

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

const ARTICLE_CARD_HEIGHT = 285; // IMPORTANT: This should be updated every time something is changed (used for getItemLayout optimization)

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  navigate,
  unread = true,
  preferences,
  verification = false,
  overrideImageWidth = 140,
}) => {
  const theme = useTheme();
  const { colors } = theme;

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
    <CardBase onPress={navigate}>
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Title numberOfLines={2} style={[readStyle]}>
              {article.title}
            </Title>
            <Caption>
              Publié {moment(article.date).fromNow()} ·{' '}
              <Icon name="eye" color={colors.subtext} size={12} />{' '}
              {typeof article.cache?.views === 'number' ? article.cache.views : '?'} ·{' '}
              <Icon name="thumb-up" color={colors.subtext} size={12} />{' '}
              {typeof article.cache?.likes === 'number' ? article.cache.likes : '?'}
            </Caption>
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
      <TagList item={article} scrollable />
      <Card.Content>
        <View style={{ flexDirection: 'row', paddingTop: 6 }}>
          {article.image?.image ? (
            <CustomImage
              image={article.image}
              imageSize="medium"
              width={overrideImageWidth}
              height={overrideImageWidth}
            />
          ) : null}
          <View
            style={{
              marginLeft: article.image?.image ? 15 : 0,
              flex: 1,
              maxHeight: overrideImageWidth,
            }}
          >
            <Paragraph
              numberOfLines={6}
              style={[
                readStyle,
                {
                  fontFamily:
                    preferences.fontFamily !== 'system' ? preferences.fontFamily : undefined,
                },
              ]}
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
                accessibilityRole="none"
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
                accessibilityRole="none"
                name="message-alert"
                color={colors.invalid}
                size={16}
                style={{ alignSelf: 'center', marginRight: 5 }}
              />
              <Text>Signalé {articleVerification.verification?.reports?.length} fois</Text>
            </View>
          )}
          {articleVerification.verification?.users?.length !== 0 &&
            !articleVerification.verification?.verified && (
              <View style={{ flexDirection: 'row' }}>
                <Icon
                  accessibilityRole="none"
                  name="shield"
                  color={colors.invalid}
                  size={16}
                  style={{ alignSelf: 'center', marginRight: 5 }}
                />
                <Text>Remis en modération</Text>
              </View>
            )}
          {articleVerification.verification?.extraVerification && (
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

export { ARTICLE_CARD_HEIGHT };

export default connect(mapStateToProps)(ArticleCard);
