import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import { Card, Paragraph, Text, useTheme, Title, Caption } from 'react-native-paper';
import moment from 'moment';
import { StackNavigationProp } from '@react-navigation/stack';

import { ArticlePreload } from '@ts/types';
import { getImageUrl } from '@utils/index';
import getStyles from '@styles/Styles';

import { CardBase } from '../Cards';
import TagList from '../TagList';

type Props = {
  article: ArticlePreload;
  navigate: StackNavigationProp<any, any>['navigate'];
  unread: boolean;
};

const screenDimensions = Dimensions.get('window');
const minWidth = Math.min(screenDimensions.height, screenDimensions.width);
const imageSize = minWidth / 3.5;

const ArticleCard: React.FC<Props> = ({ article, navigate, unread }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const readStyle = !unread && { color: colors.disabled };

  return (
    <CardBase onPress={navigate} contentContainerStyle={{ paddingTop: 0, paddingBottom: 0 }}>
      <View style={{ marginVertical: 5 }}>
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
              <Paragraph numberOfLines={6} style={readStyle}>
                {article?.summary}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
        <Card.Content style={{ marginTop: 5, paddingHorizontal: 0 }}>
          <TagList item={article} scrollable={false} />
        </Card.Content>
      </View>
    </CardBase>
  );
};

export default ArticleCard;
