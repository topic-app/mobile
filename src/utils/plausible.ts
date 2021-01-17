import { Platform } from 'react-native';

import Store from '@redux/store';

import { EventOptions } from './plausible/request';
import Plausible, { PlausibleOptions } from './plausible/tracker';

const plausible = Plausible({
  domain: Platform.OS === 'web' ? 'topicapp.fr' : 'app.topicapp.fr',
  apiHost: 'https://stats.topicapp.fr',
});

const { trackPageview: initialTrackPageView, trackEvent: initialTrackEvent } = plausible;

const trackPageview = (props: PlausibleOptions) => {
  if (Store.getState()?.preferences?.analytics) {
    initialTrackPageView(props);
  }
};

const trackEvent = (name: string, props?: EventOptions, data?: PlausibleOptions) => {
  if (Store.getState()?.preferences?.analytics) {
    initialTrackEvent(name, props, data);
  }
};

export { trackPageview, trackEvent };
export default plausible;

export type { PlausibleOptions } from './plausible/tracker';
export type { EventOptions } from './plausible/request';
