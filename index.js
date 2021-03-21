import { registerRootComponent } from 'expo';
import { Platform, AppRegistry } from 'react-native';

import App from './App';

/* eslint-disable global-require */
if (Platform.OS === 'android' || global.HermesInternal) {
  require('@formatjs/intl-getcanonicallocales/polyfill');
  require('@formatjs/intl-locale/polyfill');

  require('@formatjs/intl-pluralrules/polyfill');
  require('@formatjs/intl-pluralrules/locale-data/fr'); // use your language files

  require('@formatjs/intl-relativetimeformat/polyfill');
  require('@formatjs/intl-relativetimeformat/locale-data/fr'); // use your language files

  require('@formatjs/intl-listformat/polyfill');
  require('@formatjs/intl-listformat/locale-data/fr'); // use your language files

  require('@formatjs/intl-displaynames/polyfill');
  require('@formatjs/intl-displaynames/locale-data/fr'); // use your language files

  require('@formatjs/intl-numberformat/polyfill');
  require('@formatjs/intl-numberformat/locale-data/fr'); // use your language files

  require('@formatjs/intl-datetimeformat/polyfill');
  require('@formatjs/intl-datetimeformat/locale-data/fr'); // use your language files

  require('@formatjs/intl-datetimeformat/add-golden-tz');

  // https://formatjs.io/docs/polyfills/intl-datetimeformat/#default-timezone

  const RNLocalize = require('react-native-localize'); // eslint-disable-line import/order

  if ('__setDefaultTimeZone' in Intl.DateTimeFormat) {
    Intl.DateTimeFormat.__setDefaultTimeZone(RNLocalize.getTimeZone());
  }
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
// AppRegistry.registerComponent('main', () => App);
