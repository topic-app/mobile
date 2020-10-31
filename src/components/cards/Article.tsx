import React from 'react';
import { View, Dimensions } from 'react-native';
import { Card, Paragraph, Text, Title, Caption } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';
import moment from 'moment';

import { ArticlePreload, State, Preferences } from '@ts/types';
import { useTheme } from '@utils/index';

import { CardBase } from '../Cards';
import TagList from '../TagList';
import CustomImage from '../CustomImage';

type ArticleCardProps = {
  article: ArticlePreload;
  navigate: StackNavigationProp<any, any>['navigate'];
  unread: boolean;
  preferences: Preferences;
  verification: boolean;
};

const screenDimensions = Dimensions.get('window');
const minWidth = Math.min(screenDimensions.height, screenDimensions.width);
const imageSize = minWidth / 3.5;

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  navigate,
  unread = true,
  preferences,
  verification = false,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  const readStyle = !unread && { color: colors.disabled };

  return (
    <CardBase onPress={navigate}>
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Title numberOfLines={2} style={readStyle}>
              {article?.title}
            </Title>
            <Caption>{`Publié ${moment(article?.date).fromNow()}`}</Caption>
          </View>
          {verification && (
            <View
              style={{
                borderRadius: 20,
                backgroundColor: ([
                  ['green', [0]],
                  ['yellow', [1, 2]],
                  ['orange', [3, 4, 5]],
                ].find((c) => c[1].includes(article?.verification?.bot?.score)) || [
                  'red',
                ])[0].toString(),
                height: 40,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 20, color: 'black' }}>
                {article?.verification?.bot?.score}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: 'row', paddingTop: 6 }}>
          <CustomImage
            image={article?.image}
            imageSize="small"
            width={imageSize}
            height={imageSize}
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
      {verification && (
        <Card.Content>
          {article?.verification?.bot?.flags?.length !== 0 && (
            <Text>Classifié comme {article?.verification?.bot?.flags?.join(', ')}</Text>
          )}
          {article?.verification?.reports?.length !== 0 && (
            <Text>Reporté {article?.verification?.reports?.length} fois </Text>
          )}
          {article?.verification?.users?.length !== 0 && (
            <Text>Approuvé par {article?.verification?.users?.join(', ')}</Text>
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

export default connect(mapStateToProps)(ArticleCard);
