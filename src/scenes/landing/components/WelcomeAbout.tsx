import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View, Platform, FlatList, useWindowDimensions } from 'react-native';
import { List, Subheading, useTheme, Title, Text, Divider, Button } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { connect } from 'react-redux';

import { WelcomeWavesBottom, WelcomeWavesTop } from '@assets/index';
import { ArticleCard, GroupCard, Illustration } from '@components';
import { updateArticles } from '@redux/actions/api/articles';
import { updateGroups } from '@redux/actions/api/groups';
import getStyles from '@styles/global';
import {
  Article,
  ArticlePreload,
  ArticleRequestState,
  Group,
  GroupPreload,
  GroupRequestState,
  LocationState,
  State,
} from '@ts/types';
import { handleUrl, trackEvent } from '@utils';

type Props = {
  groups: (GroupPreload | Group)[];
  articles: (ArticlePreload | Article)[];
  state: {
    groups: GroupRequestState;
    articles: ArticleRequestState;
  };
  showDownload?: boolean;
  location: LocationState;
};

const WelcomeAbout: React.FC<Props> = ({
  groups,
  articles,
  state,
  location,
  showDownload = true,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const navigation = useNavigation();

  const { width } = useWindowDimensions();

  React.useEffect(() => {
    if (location.selected) {
      updateGroups('initial');
      updateArticles('initial');
    } else {
      updateGroups('initial', { global: true, number: 12 }, false);
      updateArticles('initial', { global: true, number: 12 }, false);
    }
  }, []);

  const detectOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor || '';

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return;
    }

    if (/android/i.test(userAgent)) {
      return 'android';
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'ios';
    }
  };

  const menuItems = [
    {
      key: 'about',
      text: '?? propos',
      navigate: () =>
        navigation.navigate('Root', {
          screen: 'Main',
          params: {
            screen: 'More',
            params: { screen: 'About', params: { screen: 'List' } },
          },
        }),
    },
    {
      key: 'sponsors',
      text: 'Partenaires',
      navigate: () =>
        navigation.navigate('Root', {
          screen: 'Main',
          params: {
            screen: 'More',
            params: { screen: 'About', params: { screen: 'List', params: { page: 'sponsors' } } },
          },
        }),
    },
    {
      key: 'mentions',
      text: 'Mentions l??gales',
      navigate: () =>
        navigation.navigate('Root', {
          screen: 'Main',
          params: {
            screen: 'More',
            params: { screen: 'About', params: { screen: 'Legal', params: { page: 'mentions' } } },
          },
        }),
    },
    {
      key: 'conditions',
      text: "Conditions d'utilisation",
      navigate: () =>
        navigation.navigate('Root', {
          screen: 'Main',
          params: {
            screen: 'More',
            params: {
              screen: 'About',
              params: { screen: 'Legal', params: { page: 'conditions' } },
            },
          },
        }),
    },
    {
      key: 'privacy',
      text: 'Vie priv??e',
      navigate: () =>
        navigation.navigate('Root', {
          screen: 'Main',
          params: {
            screen: 'More',
            params: {
              screen: 'About',
              params: { screen: 'Legal', params: { page: 'confidentialite' } },
            },
          },
        }),
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <WelcomeWavesTop width="100%" height={width * 0.08} />
      <View style={{ backgroundColor: '#592989', marginVertical: -(width * 0.03) }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            marginVertical: 60,
          }}
        >
          <View style={{ alignItems: 'center', width: 400 }}>
            <Illustration name="article" />
            <Title style={[styles.title, { color: 'white' }]}>Actus</Title>
            <Text style={[{ color: 'white', textAlign: 'center' }]}>
              D??couvrez et partagez votre actualit??
            </Text>
          </View>
          <View style={{ alignItems: 'center', width: 400 }}>
            <Illustration name="event" />
            <Title style={[styles.title, { color: 'white' }]}>??v??nements</Title>
            <Text style={[{ color: 'white', textAlign: 'center' }]}>
              Retrouvez et participez aux activit??s autour de vous
            </Text>
          </View>
          {/* <View style={{ alignItems: 'center' }}>
            <Illustration name="explore" />
            <Title style={[styles.title, { color: 'white' }]}>Carte</Title>
            <Text style={[{ color: 'white' }]}>
            </Text>
          </View> */}
          <View style={{ alignItems: 'center', width: 400 }}>
            <Illustration name="group" />
            <Title style={[styles.title, { color: 'white' }]}>Groupes</Title>
            <Text style={[{ color: 'white', textAlign: 'center' }]}>
              Le r??seau d&apos;engagement pour clubs, associations...
            </Text>
          </View>
        </View>
      </View>
      <WelcomeWavesBottom width="100%" height={width * 0.08} />
      {showDownload && (
        <View style={{ marginTop: 60 }}>
          <View style={styles.centerIllustrationContainer}>
            <Title style={[styles.title, { textAlign: 'center' }]}>
              T??l??chargez l&apos;application
            </Title>
            <Subheading style={[styles.subtitle, { textAlign: 'center', color: colors.text }]}>
              Retrouvez l&apos;actualit?? engag??e et d??couvrez ce qui se passe autour de vous,
              directement sur votre t??l??phone
            </Subheading>
            <View style={{ marginTop: 20, flexDirection: 'row' }}>
              <Button
                mode={detectOS() === 'android' ? 'contained' : 'outlined'}
                onPress={() => {
                  trackEvent('homepage:download-button', { props: { os: 'android' } });
                  handleUrl('https://play.google.com/store/apps/details?id=fr.topicapp.topic', {
                    trusted: true,
                  });
                }}
                icon="android"
                style={{ marginRight: 10 }}
                uppercase={false}
              >
                Android
              </Button>
              <Button
                mode={detectOS() === 'ios' ? 'contained' : 'outlined'}
                onPress={() => {
                  trackEvent('homepage:download-button', { props: { os: 'ios' } });
                  handleUrl('https://apps.apple.com/fr/app/topic/id1545178171', { trusted: true });
                }}
                icon="apple"
                style={{ marginLeft: 10 }}
                uppercase={false}
              >
                iOS
              </Button>
            </View>
          </View>
        </View>
      )}
      <View style={[{ marginTop: 60 }]}>
        <View style={[styles.centerIllustrationContainer, { marginBottom: 30 }]}>
          <Title style={styles.title}>Groupes populaires</Title>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
          {groups.map((g) => (
            <View style={{ width: 400 }}>
              <GroupCard
                group={g}
                navigate={() =>
                  navigation.navigate('Root', {
                    screen: 'Main',
                    params: {
                      screen: 'Display',
                      params: {
                        screen: 'Group',
                        params: { screen: 'Display', params: { id: g._id } },
                      },
                    },
                  })
                }
              />
            </View>
          ))}
        </View>
      </View>
      <View style={[{ marginTop: 100 }]}>
        <View style={[styles.centerIllustrationContainer, { marginBottom: 30 }]}>
          <Title style={styles.title}>Articles du moment</Title>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
          {articles.map((a) => (
            <View style={{ width: 400 }}>
              <ArticleCard
                article={a}
                navigate={() =>
                  navigation.navigate('Root', {
                    screen: 'Main',
                    params: {
                      screen: 'Display',
                      params: {
                        screen: 'Article',
                        params: { screen: 'Display', params: { id: a._id } },
                      },
                    },
                  })
                }
              />
            </View>
          ))}
        </View>
      </View>
      <View style={{ marginBottom: 30 }}></View>
      <Divider />
      <View
        style={[
          styles.container,
          {
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          },
        ]}
      >
        <View style={{ flex: 1, alignContent: 'center', marginTop: -5 }}>
          <Illustration name="topic-icon-text" height="50" />
        </View>
        <View style={{ flex: 1, flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
          {menuItems.map((m) => (
            <Button key={m.key} mode="text" uppercase={false} onPress={m.navigate}>
              {m.text}
            </Button>
          ))}
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { groups, articles, location } = state;
  return {
    location,
    groups: groups.data,
    articles: articles.data,
    state: { groups: groups.state, articles: articles.state },
  };
};

export default connect(mapStateToProps)(WelcomeAbout);
