import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import { Card, Paragraph, Text, useTheme, Title, Caption } from 'react-native-paper';
import moment from 'moment';
import { StackNavigationProp } from '@react-navigation/stack';

import { ArticlePreload, State, Preferences } from '@ts/types';
import { getImageUrl } from '@utils/index';
import getStyles from '@styles/Styles';
import { connect } from 'react-redux';

import { CardBase } from '../Cards';
import TagList from '../TagList';

type Props = {
  article: ArticlePreload;
  navigate: StackNavigationProp<any, any>['navigate'];
  unread: boolean;
  preferences: Preferences;
};

const screenDimensions = Dimensions.get('window');
const minWidth = Math.min(screenDimensions.height, screenDimensions.width);
const imageSize = minWidth / 3.5;

const ArticleCard: React.FC<Props> = ({ article, navigate, unread, preferences }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const readStyle = !unread && { color: colors.disabled };

  return (
    <CardBase onPress={navigate}>
      <Card.Content>
        <Title numberOfLines={2} style={readStyle}>
          {article?.title}
        </Title>
        <Caption>{`Publié ${moment(article?.date).fromNow()}`}</Caption>
        <View style={{ flexDirection: 'row', paddingTop: 6 }}>
          <Image
            source={{ uri: getImageUrl({ image: article?.image, size: 'small' }) }}
            style={[styles.thumbnail, { width: imageSize, height: imageSize }]}
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
              {article?.summary}
            </Paragraph>
          </View>
        </View>
      </Card.Content>
      <Card.Content style={{ marginTop: 5, paddingHorizontal: 0 }}>
        <TagList item={article} scrollable={false} />
      </Card.Content>
    </CardBase>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return {
    preferences,
  };
};

export default connect(mapStateToProps)(ArticleCard);
