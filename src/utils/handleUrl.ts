import _ from 'lodash';
import { Appearance, Linking, Platform } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import parseUrl from 'url-parse';

import { Config } from '@constants';
import themes from '@styles/helpers/theme';

import Alert from './compat/alert';

async function openUrl(targetUrl: string, customTab = true) {
  if (Platform.OS === 'android' && (await InAppBrowser.isAvailable()) && customTab) {
    const systemTheme = Appearance.getColorScheme() || 'light';
    const { colors } = themes[systemTheme];
    await InAppBrowser.open(targetUrl, {
      // Android Properties
      showTitle: true,
      toolbarColor: colors.appBar,
      secondaryToolbarColor: colors.appBarButton,
      enableUrlBarHiding: true,
      enableDefaultShare: true,
      forceCloseOnRedirection: false,
      headers: {},
    });
  } else {
    await Linking.openURL(targetUrl);
  }
}

function handleUrl(
  targetUrl: string,
  { customTab = true, trusted = false }: { customTab?: boolean; trusted?: boolean } = {
    customTab: true,
    trusted: false,
  },
) {
  const { protocol, slashes, hostname } = parseUrl(targetUrl, true);

  // Only allow opening http:// and https://
  if (!(['http:', 'https:'].includes(protocol) && slashes)) {
    return Alert.alert('Lien invalide', targetUrl);
  }

  const { allowedSites } = Config.content;

  if (
    allowedSites.some(({ url, allowSubdomains }) => {
      const allowedHostname = parseUrl(url).hostname;
      if (allowSubdomains) return hostname.endsWith(allowedHostname);
      return hostname === allowedHostname;
    }) ||
    trusted
  ) {
    openUrl(targetUrl, customTab);
  } else {
    // In the future, we could add a warning that this site is HTTP, or possibly trying to impersonate another site
    const truncatedUrl = _.truncate(targetUrl, { length: 50, separator: '...' });
    Alert.alert(
      `Ouvrir ${hostname} ?`,
      `Topic n'endorse pas le contenu de ce site\n${truncatedUrl}`,
      [
        {
          text: 'Annuler',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Ouvrir',
          onPress: () => openUrl(targetUrl, customTab),
        },
      ],
      { cancelable: true },
    );
  }
}

export default handleUrl;
