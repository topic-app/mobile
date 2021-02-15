import { RouteProp } from '@react-navigation/core';
import React from 'react';
import { View, Appearance, FlatList, ActivityIndicator, Platform } from 'react-native';
import { List, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  CustomHeaderBar,
  ErrorMessage,
  PlatformBackButton,
  PlatformTouchable,
} from '@components/index';
import { fetchGroupPage } from '@redux/actions/api/pages';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { Account, GroupRequestState, GroupsState, Pages, Preferences, State } from '@ts/types';
import { useSafeAreaInsets, useTheme } from '@utils/index';

import Page from '../components/Page';
import type { PagesScreenNavigationProp, PagesStackParams } from '../index';
import getSettingsStyles from '../styles/Styles';

type PageDisplayProps = {
  navigation: PagesScreenNavigationProp<'Display'>;
  route: RouteProp<PagesStackParams, 'Display'>;
  pages: GroupsState['pages'];
  state: GroupRequestState;
};

const PageDisplay: React.FC<PageDisplayProps> = ({ navigation, route, pages, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getSettingsStyles(theme);
  const { colors } = theme;

  const { group, page } = route.params || {};

  const fetchPage = () => {
    fetchGroupPage({ group, page });
  };

  React.useEffect(fetchPage, [group, page]);

  console.log(JSON.stringify(state.pages, null, 2));

  const header = pages.headers.find((h) => h.group === group)?.content || []; // TODO: currently assumes we are only using ids, needs to be able to use handles as well
  const footer = pages.footers.find((h) => h.group === group)?.content || [];
  const pageDoc = pages.pages.find((p) => p.group === group && (page ? p.page === page : p.main));

  const fullPage = {
    page: page || 'main',
    group,
    main: pageDoc?.main || false,
    content: pageDoc ? [...header, ...pageDoc.content, ...footer] : header,
  };

  const insets = useSafeAreaInsets();

  /* const page: Pages.Page = {
    page: 'main',
    group: 'test',
    main: true,
    header: [
      {
        id: '1',
        type: 'gradient',
        data: { start: '#592989', end: '#123456', angle: 45 },
        columns: [
          {
            id: '2',
            align: 'center',
            elements: [
              {
                id: '3',
                type: 'image',
                data: {
                  image: { image: '60297548f44181001a19c8af', thumbnails: { large: true } },
                  mode: 'contain',
                  height: 100,
                },
              },
              {
                id: '4',
                type: 'menu',
                data: {
                  color: '#FFFFFF',
                  elements: [
                    {
                      id: '4a',
                      type: 'external',
                      text: 'Présentation',
                      url: 'https://example.org',
                    },
                    { id: '4b', type: 'internal', text: 'Membres', page: 'secondary' },
                    {
                      id: '4c',
                      type: 'menu',
                      text: 'Initiatives',
                      items: [
                        {
                          id: '4ca',
                          type: 'internal',
                          text: 'Initiative 1',
                          page: 'test',
                        },
                        {
                          id: '4cb',
                          type: 'internal',
                          text: 'Initiative 2',
                          page: 'test',
                        },
                        {
                          id: '4cc',
                          type: 'external',
                          text: 'Initiative 3',
                          url: 'https://example.org',
                        },
                      ],
                    }, // Links not starting with http just go to a page of the group
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
    content: [
      {
        id: '5',
        type: 'color',
        data: { color: '#FFFFFF' },
        columns: [
          {
            id: '6',
            elements: [
              {
                id: '7',
                type: 'content',
                data: {
                  content: {
                    data:
                      "# CVL du Centre International de Valbonne\nVoila une description. Du contenu formatté (avec du **gras**, de *l'italique*, des [liens](https://example.org) etc)\n",
                    parser: 'markdown',
                  },
                  color: '#000000',
                  size: 20,
                },
              },
            ],
          },
          {
            id: '8',
            size: 2,
            elements: [
              {
                id: '9',
                type: 'content',
                align: 'center',
                data: {
                  content: {
                    data: '## Titre centré',
                    parser: 'markdown',
                  },
                  color: '#000000',
                  size: 20,
                },
              },
              {
                id: '9b',
                type: 'content',
                align: 'center',
                data: {
                  content: {
                    data: '### Sous titre',
                    parser: 'markdown',
                  },
                  color: '#2222BB',
                  size: 20,
                },
              },
              {
                id: '9c',
                type: 'content',
                data: {
                  content: {
                    data:
                      'Et du contenu en dessous.\n - Une liste\n - Avec plusieurs éléments\n - Par exemple',
                    parser: 'markdown',
                  },
                  color: '#000000',
                  size: 20,
                },
              },
            ],
          },
        ],
      },
      {
        id: '10',
        type: 'image',
        minHeight: 350,
        data: {
          image: {
            image: '60297662f44181001a19c8b1',
            thumbnails: {
              small: false,
            },
          },
          mode: 'contain',
        },

        columns: [
          {
            id: '11',
            align: 'center',
            alignVertical: 'center',
            elements: [
              {
                id: '12',
                type: 'menu',
                data: {
                  height: 50,
                  elements: [
                    {
                      id: '12a',
                      text: 'Rejoindre',
                      dark: false,
                      color: '#4499FF',
                      type: 'internal',
                      page: 'join',
                      mode: 'contained',
                    },
                    {
                      id: '12b',
                      color: '#FFFFFF',
                      text: 'Contacter',
                      type: 'internal',
                      page: 'contact',
                      mode: 'contained',
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        id: '13',
        type: 'color',
        data: { color: '#EEEEEE' },
        minHeight: 200,
        columns: [
          {
            id: '14',
            elements: [
              {
                id: '15',
                type: 'content',
                data: {
                  content: {
                    data:
                      '### Découvrez nos articles et nos évènements !\nToutes les actualités du Centre International de Valbonne, directement sur notre site web.',
                    parser: 'markdown',
                  },
                  theme: 'light',
                  color: '#000000',
                  size: 20,
                },
              },
              {
                id: '16',
                type: 'contentTabView',
                data: {
                  max: 4,
                  types: ['articles', 'events'],
                  theme: 'light',
                  params: { groups: ['5fe204169543ce00190c5624'] },
                },
              },
            ],
          },
        ],
      },
    ],
    footer: [],
  }; */

  return (
    <View style={styles.page}>
      {state.pages.error ? (
        <View style={{ marginTop: insets.top }}>
          <ErrorMessage
            type="axios"
            strings={{
              what: 'le chargement de la page',
              contentPlural: 'les informations',
              contentSingular: 'La page',
            }}
            error={state.pages.error}
            retry={fetchPage}
          />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        {Platform.OS !== 'web' && (
          <View
            style={{
              position: 'absolute',
              left: 5,
              zIndex: 1000,
              top: insets.top + 5,
              backgroundColor: colors.surface,
              height: 48,
              borderRadius: 24,
              opacity: 0.8,
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', opacity: 1, borderRadius: 24 }}
            >
              <PlatformBackButton onPress={() => navigation.goBack()} />
            </View>
          </View>
        )}

        <Page
          navigation={navigation}
          page={fullPage}
          loading={(state.pages.loading || !pageDoc) && !state.pages.error}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { groups } = state;
  return { state: groups.state, pages: groups.pages };
};
export default connect(mapStateToProps)(PageDisplay);
