import React from 'react';
import { View, Image } from 'react-native';
import { Card, Paragraph, Text, useTheme } from 'react-native-paper';
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

const ActuComponentListCard: React.FC<Props> = ({ article, navigate, unread }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <CardBase onPress={navigate}>
      <View style={{ paddingTop: 10, paddingBottom: 5 }}>
        <Card.Content>
          <Text style={[styles.cardTitle, !unread && { color: colors.disabled }]}>
            {article?.title}
          </Text>
        </Card.Content>
        <Card.Content style={{ marginTop: 5 }}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={{ uri: getImageUrl({ image: article?.image, size: 'small' }) }}
              style={[
                styles.thumbnail,
                {
                  width: 120,
                  height: 120,
                },
              ]}
            />
            <View
              style={{
                margin: 10,
                marginTop: 0,
                marginLeft: 15,
                flex: 1,
              }}
            >
              <Text style={styles.subtitle}>Publié {moment(article?.date).fromNow()}</Text>
              <Paragraph style={[styles.text, !unread && { color: colors.disabled }]}>
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

export default ActuComponentListCard;
