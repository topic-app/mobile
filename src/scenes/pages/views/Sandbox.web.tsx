import { RouteProp } from '@react-navigation/core';
import React from 'react';
import { View, Appearance, FlatList, ActivityIndicator, Platform, ScrollView } from 'react-native';
import {
  Banner,
  HelperText,
  IconButton,
  List,
  Switch,
  Text,
  TextInput,
  Title,
} from 'react-native-paper';
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
import { logger, useSafeAreaInsets, useTheme } from '@utils/index';

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

  const [header, setHeader] = React.useState([]);
  const [content, setContent] = React.useState([]);
  const [footer, setFooter] = React.useState([]);
  const [errorHeader, setErrorHeader] = React.useState('');
  const [errorContent, setErrorContent] = React.useState('');
  const [errorFooter, setErrorFooter] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [mobile, setMobile] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);

  const fullPage: Pages.Page = {
    page: 'main',
    group: 'test',
    content,
    main: true,
  };

  function isContent(page: any): page is Pages.Page['content'] {
    // This is ugly, but runtime type-checking is too complicated
    return (
      Array.isArray(page) &&
      page.every(
        (p: any) =>
          typeof p.id === 'string' &&
          (p.type === 'image' ||
            p.type === 'color' ||
            p.type === 'gradient' ||
            p.type === 'loader') &&
          typeof p.data === 'object' &&
          p.columns.every(
            (c: any) =>
              typeof c.id === 'string' &&
              c.elements.every(
                (e: any) =>
                  typeof e.id === 'string' &&
                  (e.type === 'content' ||
                    e.type === 'image' ||
                    e.type === 'contentTabView' ||
                    e.type === 'menu' ||
                    e.type === 'title' ||
                    e.type === 'spacer') &&
                  typeof e.data === 'object',
              ),
          ),
      )
    );
  }

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.page, { flexDirection: 'row' }]}>
      <View style={{ flex: 1, flexGrow: 2, maxWidth: mobile ? 400 : undefined }}>
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
              flexDirection: 'row',
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', opacity: 1, borderRadius: 24 }}
            >
              <PlatformBackButton onPress={() => navigation.goBack()} />
            </View>
          </View>
        )}

        {fullscreen && (
          <View
            style={{
              position: 'absolute',
              right: 5,
              zIndex: 1000,
              top: insets.top + 5,
              backgroundColor: colors.surface,
              height: 48,
              borderRadius: 24,
              opacity: 0.8,
              flexDirection: 'row',
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', opacity: 1, borderRadius: 24 }}
            >
              <IconButton icon="fullscreen-exit" onPress={() => setFullscreen(false)} />
            </View>
          </View>
        )}

        <Page
          navigation={navigation}
          page={fullPage}
          header={header}
          footer={footer}
          loading={loading}
        />
      </View>
      <View
        style={{ backgroundColor: colors.disabled, width: fullscreen ? 0 : 2, height: '100%' }}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.surface, maxWidth: fullscreen ? 0 : undefined }}
      >
        <View style={[styles.container, { backgroundColor: colors.surface, flex: 1 }]}>
          <Title style={{ textAlign: 'center' }}>Environnement de test - pages groupe</Title>
          <TextInput
            multiline
            mode="outlined"
            label="Header"
            error={!!errorHeader}
            numberOfLines={10}
            onChangeText={(text) => {
              try {
                logger.info(`Checking ${text}`);
                if (isContent(JSON.parse(text))) {
                  setErrorHeader('');
                  setHeader(JSON.parse(text));
                } else {
                  logger.info('Invalid type');
                  setErrorHeader('Données non valides');
                }
              } catch (err) {
                logger.info('Invalid JSON');
                setErrorHeader('Erreur dans le JSON');
              }
            }}
          />
          <HelperText visible={!!errorHeader} type="error">
            {errorHeader}
          </HelperText>
          <TextInput
            multiline
            mode="outlined"
            label="Contenu"
            error={!!errorContent}
            numberOfLines={20}
            onChangeText={(text) => {
              try {
                logger.info(`Checking ${text}`);
                if (isContent(JSON.parse(text))) {
                  setErrorContent('');
                  setContent(JSON.parse(text));
                } else {
                  logger.info('Invalid type');
                  setErrorContent('Données non valides');
                }
              } catch (err) {
                logger.info(err);
                logger.info('Invalid JSON');
                setErrorContent('Erreur dans le JSON');
              }
            }}
          />
          <HelperText visible={!!errorContent} type="error">
            {errorContent}
          </HelperText>
          <TextInput
            multiline
            mode="outlined"
            label="Footer"
            error={!!errorFooter}
            numberOfLines={10}
            onChangeText={(text) => {
              try {
                logger.info(`Checking ${text}`);
                if (isContent(JSON.parse(text))) {
                  setErrorFooter('');
                  setFooter(JSON.parse(text));
                } else {
                  logger.info('Invalid type');
                  setErrorFooter('Données non valides');
                }
              } catch (err) {
                logger.info('Invalid JSON');
                setErrorFooter('Erreur dans le JSON');
              }
            }}
          />
          <HelperText visible={!!errorFooter} type="error">
            {errorFooter}
          </HelperText>
          <List.Item
            title="Chargement"
            onPress={() => setLoading(!loading)}
            right={() => (
              <Switch value={loading} onValueChange={setLoading} color={colors.primary} />
            )}
          />
          <List.Item
            title="Version mobile"
            onPress={() => setMobile(!mobile)}
            right={() => <Switch value={mobile} onValueChange={setMobile} color={colors.primary} />}
          />
          <List.Item
            title="Plein écran"
            onPress={() => setFullscreen(!fullscreen)}
            right={() => (
              <Switch value={fullscreen} onValueChange={setFullscreen} color={colors.primary} />
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { groups } = state;
  return { state: groups.state, pages: groups.pages };
};
export default connect(mapStateToProps)(PageDisplay);
