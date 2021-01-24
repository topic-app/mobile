import { logger } from '@utils';

import type { PlausibleOptions } from './tracker';

/**
 * @internal
 */
type EventPayload = {
  readonly n: string;
  readonly u: string;
  readonly d: string;
  readonly r: string | null;
  readonly w: number;
  readonly h: 1 | 0;
  readonly p?: string;
};

export type EventOptions = {
  /**
   * Callback called when the event is successfully sent.
   */
  readonly callback?: () => void;
  /**
   * Properties to be bound to the event.
   */
  readonly props?: { readonly [propName: string]: string };
};

/**
 * @internal
 * Sends an event to Plausible's API
 *
 * @param data - Event data to send
 * @param options - Event options
 */
export function sendEvent(
  eventName: string,
  data: Required<PlausibleOptions>,
  options?: EventOptions,
): void {
  const isLocalhost = __DEV__;

  const payload: EventPayload = {
    n: eventName,
    u: data.url,
    d: data.domain,
    r: data.referrer,
    w: data.deviceWidth,
    h: data.hashMode ? 1 : 0,
    p: options && options.props ? JSON.stringify(options.props) : undefined,
  };

  if (!data.trackLocalhost && isLocalhost) {
    logger.debug(
      `[Plausible] Ignoring event because app is running locally : ${JSON.stringify(payload)}`,
    );
  }

  logger.debug(`[Plausible] sending event ${eventName}`);
  const req = new XMLHttpRequest();
  req.open('POST', `${data.apiHost}/api/event`, true);
  req.setRequestHeader('Content-Type', 'text/plain');
  req.send(JSON.stringify(payload));
  req.onreadystatechange = () => {
    if (req.readyState !== 4) return;
    if (options && options.callback) {
      options.callback();
    }
  };
}
