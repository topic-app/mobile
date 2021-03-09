import { RouteProp, useFocusEffect } from '@react-navigation/core';
import React from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';
import { Subheading } from 'react-native-paper';
import { connect } from 'react-redux';

import { AnimatingHeader, FeedbackCard, Illustration } from '@components';
import { Config } from '@constants';
import getStyles from '@styles/Styles';
import { State } from '@ts/types';
import { useTheme } from '@utils';

import ArticleDisplay from '../../../display/articles/views/Display';
import { HomeTwoScreenNavigationProp, HomeTwoNavParams } from '../../HomeTwo';
import ArticleListComponent from './ListComponent';

type ArticleListProps = {
  navigation: HomeTwoScreenNavigationProp<'Article'>;
  route: RouteProp<HomeTwoNavParams, 'Article'>;
  historyEnabled: boolean;
  locationSelected: boolean;
  appOpens: number;
};

const ArticleListScreen: React.FC<ArticleListProps> = ({
  navigation,
  route,
  historyEnabled,
  locationSelected,
  appOpens,
}) => {
  const [article, setArticle] = React.useState<{
    id: string;
    title: string;
    useLists: boolean;
  } | null>(null);

  const theme = useTheme();
  const deviceWidth = useWindowDimensions().width;
  const styles = getStyles(theme);
  const { colors } = theme;

  useFocusEffect(() => {
    if (!locationSelected) {
      navigation.navigate('Landing', {
        screen: 'SelectLocation',
        params: { goBack: false },
      });
    }
  });

  const scrollY = new Animated.Value(0);

  const headerOverflow = [
    {
      title: 'Catégories',
      onPress: () =>
        navigation.navigate('Main', {
          screen: 'Configure',
          params: {
            screen: 'Article',
          },
        }),
    },
    {
      title: 'Localisation',
      onPress: () =>
        navigation.navigate('Main', {
          screen: 'Params',
          params: {
            screen: 'Article',
          },
        }),
    },
  ];

  if (historyEnabled) {
    headerOverflow.push({
      title: 'Historique',
      onPress: () =>
        navigation.navigate('Main', {
          screen: 'History',
          params: {
            screen: 'Article',
          },
        }),
    });
  }

  const shouldRenderDualView = deviceWidth > Config.layout.dualMinWidth;

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ flexGrow: 1, flex: 1 }}>
        <AnimatingHeader
          home
          value={scrollY}
          title="Actus"
          actions={[
            {
              icon: 'magnify',
              onPress: () =>
                navigation.navigate('Main', {
                  screen: 'Search',
                  params: {
                    screen: 'Search',
                    params: { initialCategory: 'articles' },
                  },
                }),
            },
          ]}
          overflow={headerOverflow}
        />
        <ArticleListComponent
          scrollY={scrollY}
          initialTabKey={route.params?.initialList}
          onArticleCreatePressed={() =>
            navigation.navigate('Main', {
              screen: 'Add',
              params: { screen: 'Article', params: { screen: 'Add' } },
            })
          }
          onArticlePress={
            shouldRenderDualView
              ? (articleData) => setArticle(articleData)
              : (articleData) =>
                  navigation.navigate('Main', {
                    screen: 'Display',
                    params: {
                      screen: 'Article',
                      params: { screen: 'Display', params: articleData },
                    },
                  })
          }
          onConfigurePressed={() =>
            navigation.navigate('Main', { screen: 'Configure', params: { screen: 'Article' } })
          }
        />
      </View>
      {shouldRenderDualView ? (
        <>
          <View style={{ backgroundColor: colors.disabled, width: 1 }} />
          <View style={{ flexGrow: 2, flex: 1 }}>
            {article ? (
              <ArticleDisplay
                key={article.id}
                navigation={navigation}
                route={{
                  key: 'ArticleDisplayDualPane',
                  name: 'Display',
                  params: {
                    id: article.id,
                    title: article.title,
                    useLists: article.useLists,
                    verification: false,
                  },
                }}
                dual
              />
            ) : (
              <View style={styles.centerIllustrationContainer}>
                <Illustration name="article" width={500} height={500} />
                <Subheading>Séléctionnez un article</Subheading>
              </View>
            )}
          </View>
        </>
      ) : null}
      {appOpens > 5 && (
        <View
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <FeedbackCard closable type="thirdopen" />
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences, location } = state;
  return {
    historyEnabled: preferences.history,
    locationSelected: location.selected,
    appOpens: preferences.appOpens,
  };
};

export default connect(mapStateToProps)(ArticleListScreen);
