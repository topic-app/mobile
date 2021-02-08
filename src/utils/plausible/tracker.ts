import { Dimensions, Platform } from 'react-native';

import { EventOptions, sendEvent } from './request';

/**
 * Options used when initializing the tracker.
 */
export type PlausibleInitOptions = {
  /**
   * If true, pageviews will be tracked when the URL hash changes.
   * Enable this if you are using a frontend that uses hash-based routing.
   */
  readonly hashMode?: boolean;
  /**
   * Set to true if you want events to be tracked when running the site locally.
   */
  readonly trackLocalhost?: boolean;
  /**
   * The domain to bind the event to.
   * Defaults to `location.hostname`
   */
  readonly domain?: string;
  /**
   * The API host where the events will be sent.
   * Defaults to `'https://plausible.io'`
   */
  readonly apiHost?: string;
};

/**
 * Data passed to Plausible as events.
 */
export type PlausibleEventData = {
  /**
   * The URL to bind the event to.
   * Defaults to `location.href`.
   */
  readonly url?: string;
  /**
   * The referrer to bind the event to.
   * Defaults to `document.referrer`
   */
  readonly referrer?: string | null;
  /**
   * The current device's width.
   * Defaults to `window.innerWidth`
   */
  readonly deviceWidth?: number;
};

/**
 * Options used when tracking Plausible events.
 */
export type PlausibleOptions = PlausibleInitOptions & PlausibleEventData;

/**
 * Tracks a custom event.
 *
 * Use it to track your defined goals by providing the goal's name as `eventName`.
 *
 * ### Example
 * ```js
 * import Plausible from 'plausible-tracker'
 *
 * const { trackEvent } = Plausible()
 *
 * // Tracks the 'signup' goal
 * trackEvent('signup')
 *
 * // Tracks the 'Download' goal passing a 'method' property.
 * trackEvent('Download', { props: { method: 'HTTP' } })
 * ```
 *
 * @param eventName - Name of the event to track
 * @param options - Event options.
 * @param eventData - Optional event data to send. Defaults to the current page's data merged with the default options provided earlier.
 */
type TrackEvent = (eventName: string, options?: EventOptions, eventData?: PlausibleOptions) => void;

/**
 * Manually tracks a page view.
 *
 * ### Example
 * ```js
 * import Plausible from 'plausible-tracker'
 *
 * const { trackPageview } = Plausible()
 *
 * // Track a page view
 * trackPageview()
 * ```
 *
 * @param eventData - Optional event data to send. Defaults to the current page's data merged with the default options provided earlier.
 * @param options - Event options.
 */
type TrackPageview = (eventData?: PlausibleOptions, options?: EventOptions) => void;

/**
 * Initializes the tracker with your default values.
 *
 * ### Example (es module)
 * ```js
 * import Plausible from 'plausible-tracker'
 *
 * const { enableAutoPageviews, trackEvent } = Plausible({
 *   domain: 'my-app-domain.com',
 *   hashMode: true
 * })
 *
 * enableAutoPageviews()
 *
 * function onUserRegister() {
 *   trackEvent('register')
 * }
 * ```
 *
 * ### Example (commonjs)
 * ```js
 * var Plausible = require('plausible-tracker');
 *
 * var { enableAutoPageviews, trackEvent } = Plausible({
 *   domain: 'my-app-domain.com',
 *   hashMode: true
 * })
 *
 * enableAutoPageviews()
 *
 * function onUserRegister() {
 *   trackEvent('register')
 * }
 * ```
 *
 * @param defaults - Default event parameters that will be applied to all requests.
 */
export default function Plausible(
  defaults?: PlausibleInitOptions,
): {
  readonly trackEvent: TrackEvent;
  readonly trackPageview: TrackPageview;
} {
  const getConfig = (): Required<PlausibleOptions> => ({
    hashMode: false,
    trackLocalhost: false,
    url: Platform.OS === 'web' ? 'https://topicapp.fr/' : 'https://app.topicapp.fr/',
    domain: Platform.OS === 'web' ? 'topicapp.fr' : 'app.topicapp.fr',
    referrer: (Platform.OS === 'web' ? document.referrer : null) || null,
    deviceWidth: Platform.OS === 'web' ? window.innerWidth : Dimensions.get('screen').width,
    apiHost: 'https://stats.topicapp.fr',
    ...defaults,
  });

  const trackEvent: TrackEvent = (eventName, options, eventData) => {
    sendEvent(eventName, { ...getConfig(), ...eventData }, options);
  };

  const trackPageview: TrackPageview = (eventData, options) => {
    trackEvent('pageview', options, eventData);
  };

  return {
    trackEvent,
    trackPageview,
  };
}
