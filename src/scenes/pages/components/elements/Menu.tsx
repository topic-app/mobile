import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import { Page } from '@ts/groupPages';
import { Pages } from '@ts/types';
import { handleUrl } from '@utils';

import type { PagesScreenNavigationProp } from '../..';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  element: Pages.Element<'menu'>;
  page: Page;
};

const Menu: React.FC<PageProps> = ({ navigation, element, page }) => {
  return (
    <View style={{ flexDirection: 'row', margin: 10, flexWrap: 'wrap' }}>
      {element.data.elements.map((e) => {
        if (e.type === 'menu') {
          return (
            <View style={{ marginHorizontal: 10 }}>
              <Button
                theme={e.radius ? { roundness: e.radius } : undefined}
                mode={e.mode || 'text'}
                icon={e.icon}
                uppercase={false}
                color={e.color || element.data.color}
                dark={e.dark}
                style={{ justifyContent: 'center' }}
                contentStyle={{ height: element.data.height }}
                onPress={() => {}}
              >
                {e.text}
              </Button>
            </View>
          ); // TODO, show menu <View style={{ marginHorizontal: 10 }}></View>;
        } else {
          let mode: 'outlined' | 'contained' | 'text';
          if (e.type === 'internal' && e.page === page.page) {
            if (e.mode === 'outlined') {
              mode = 'contained';
            } else {
              mode = 'outlined';
            }
          } else {
            mode = e.mode || 'text';
          }
          return (
            <View style={{ marginHorizontal: 10 }}>
              <Button
                theme={e.radius ? { roundness: e.radius } : undefined}
                mode={mode}
                icon={e.icon}
                uppercase={false}
                color={e.color || element.data.color}
                dark={e.dark}
                style={{ justifyContent: 'center' }}
                contentStyle={{ height: element.data.height }}
                onPress={() => {
                  if (e.type === 'external') {
                    handleUrl(e.url, { trusted: true });
                  } else if (e.type === 'internal') {
                    const func = e.push === false ? navigation.navigate : navigation.push; // undefined is considered push
                    func('Root', {
                      screen: 'Main',
                      params: {
                        screen: 'Pages',
                        params: {
                          screen: 'Display',
                          params: { group: page.group, page: e.page },
                        },
                      },
                    });
                  }
                }}
              >
                {e.text}
              </Button>
            </View>
          );
        }
      })}
    </View>
  );
};

export default Menu;
