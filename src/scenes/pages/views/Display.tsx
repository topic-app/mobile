import React from 'react';
import { View, Appearance, FlatList } from 'react-native';
import { List } from 'react-native-paper';
import { connect } from 'react-redux';

import { CustomHeaderBar } from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { Account, Pages, Preferences, State } from '@ts/types';
import { useTheme } from '@utils/index';

import Page from '../components/Page';
import type { PagesScreenNavigationProp } from '../index';
import getSettingsStyles from '../styles/Styles';

type PageDisplayProps = {
  navigation: PagesScreenNavigationProp<'Display'>;
};

const PageDisplay: React.FC<PageDisplayProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getSettingsStyles(theme);

  const page: Pages.Page = {
    page: 'main',
    main: true,
    content: [
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
                  image: { image: '5fee1a102a8c4700193964ad', thumbnails: { large: true } },
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
                      icon: 'pencil',
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
      {
        id: '5',
        type: 'color',
        data: { color: '#3480be' },
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
                      "# Titre\nDu contenu markdown avec du *gras* et de _l'italique_ en plus\nPuis une image parce que pourquoi pas\n[](cdn://5fda2aa2a1d6970019fdecd6)",
                    parser: 'markdown',
                  },
                  color: '#3480be',
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
                data: {
                  content: {
                    data: '# Title',
                    parser: 'markdown',
                  },
                  color: '#592989',
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
        minHeight: 400,
        data: {
          image: {
            image: '601ea35ef44181001a19c8a7',
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
                      color: '#FF0000',
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
                      mode: 'outlined',
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
        data: { color: '#3f51b5' },
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
                      "### Découvrez nos articles !\nIls sont écrits par je sais pas qui et l'équipe de rédaction. Bon je sais pas trop quoi dire d'autre sur les articles, mais il faut quand meme que ce soit une description assez longue donc voila c'est du texte au hasard.",
                    parser: 'markdown',
                  },
                  color: '#FFFFFF',
                  size: 20,
                },
              },
              {
                id: '16',
                type: 'contentTabView',
                data: {
                  max: 1,
                  types: ['articles', 'events'],
                  theme: 'dark',
                  title: 'Derniers articles de chez nous',
                  params: { groups: ['5fe204169543ce00190c5624'] },
                },
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <View style={styles.page}>
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Test',
            },
          },
        }}
      />
      <Page navigation={navigation} page={page} />
    </View>
  );
};

export default PageDisplay;
