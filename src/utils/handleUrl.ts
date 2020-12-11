import { Linking } from 'react-native';

import { Config } from '@constants/index';

import Alert from './alert';

const truncate = (str: string, len: number) => {
  return str.length > len ? `${str.substring(0, len)}..` : str;
};

type DecomposedLink = {
  valid: boolean;
  protocol?: string; // 'https'
  domain?: string; // 'topicapp'
  suffix?: string; // 'fr'
  subdomains: string[]; // ['maps']
  routes: string[];
  composed: {
    domain?: string; // topicapp.fr
    subdomain?: string; // maps.topicapp.fr
    route?: string; // api.topicapp.fr/v1
    full?: string;
  };
};

function decomposeLink(url: string): DecomposedLink {
  let currentUrl = url;
  const resultUrl: DecomposedLink = {
    valid: false,
    subdomains: [],
    routes: [],
    composed: {
      full: url,
    },
  };

  if (!currentUrl) return resultUrl;

  let continueIndex = 0;

  // STEP 1: Detect Protocol
  const protocolSeperators = ['://', ':'];
  for (let i = 0; i < protocolSeperators.length; i += 1) {
    const protocolIndex = currentUrl.indexOf(protocolSeperators[i]);
    if (protocolIndex !== -1) {
      // Found a protocol
      resultUrl.protocol = currentUrl.substring(0, protocolIndex);
      continueIndex = protocolIndex + protocolSeperators[i].length;
      break;
    }
    if (i === protocolSeperators.length - 1) {
      // Didn't find any of the seperators, assuming protocol is 'https'
      resultUrl.protocol = 'https';
    }
  }

  currentUrl = currentUrl.substring(continueIndex);

  // STEP 2: Detect domain names
  const domainEndIndex = currentUrl.indexOf('/');
  let domainString;
  if (domainEndIndex !== -1) {
    domainString = currentUrl.substring(0, domainEndIndex);
    continueIndex = domainEndIndex + 1;
  } else {
    domainString = currentUrl;
    continueIndex = -1;
  }

  const domains = domainString.split('.').reverse();
  if (domains.length > 1) {
    [resultUrl.suffix, resultUrl.domain, ...resultUrl.subdomains] = domains;
    resultUrl.valid = true;
    resultUrl.subdomains = resultUrl.subdomains.reverse();
  } else if (domains.length !== 0) {
    [resultUrl.domain] = domains;
    resultUrl.valid = true;
  }

  // Skip to end if continue index is -1
  if (continueIndex !== -1) {
    currentUrl = currentUrl.substring(continueIndex);

    // STEP 3: Detect routes
    const routeEndSeperators = ['?', '#', ':'];
    let routeString;
    for (let i = 0; i < routeEndSeperators.length; i += 1) {
      const routeEndIndex = currentUrl.indexOf(routeEndSeperators[i]);
      if (routeEndIndex !== -1) {
        // Found a route
        routeString = currentUrl.substring(0, routeEndIndex);
        continueIndex = routeEndIndex + routeEndSeperators[i].length;
        break;
      }
      if (i === routeEndSeperators.length - 1) {
        // Didn't find any of the seperators, assuming protocol is 'https'
        routeString = currentUrl;
        continueIndex = -1;
      }
    }

    if (routeString) {
      if (routeString?.includes('/')) resultUrl.routes = routeString.split('/');
      else resultUrl.routes = [routeString];
    }
  }

  // STEP 4: Compose new urls from gathered data
  const { composed, domain, suffix, subdomains, routes } = resultUrl;
  composed.domain = suffix ? `${domain}.${suffix}` : domain;
  composed.subdomain =
    subdomains.length !== 0 ? `${subdomains.join('.')}.${composed.domain}` : composed.domain;
  composed.route =
    routes.length !== 0 ? `${composed.subdomain}/${routes.join('/')}` : composed.subdomain;

  return resultUrl;
}

function handleUrl(targetUrl: string) {
  const target = decomposeLink(targetUrl);
  const { allowedSites } = Config.content;
  if (
    allowedSites.some(({ url, allowSubdomains }) => {
      const { protocol, domain, subdomains } = decomposeLink(url);
      if (allowSubdomains) return protocol === target.protocol && domain === target.domain;
      return protocol === target.protocol && subdomains === target.subdomains;
    })
  ) {
    Linking.openURL(targetUrl);
  } else {
    // In the future, we could add a warning that this site is HTTP, or possibly trying to impersonate another site
    Alert.alert(
      `Ce lien va vers ${truncate(targetUrl, 30)}. Voulez vous l'ouvrir?`,
      "Topic n'endorse en aucun cas le contenu de ce site et ne peut garantir la sureté de celui-ci.",
      [
        {
          text: 'Annuler',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Ouvrir',
          onPress: () => Linking.openURL(targetUrl),
        },
      ],
      { cancelable: false },
    );
  }
}

export default handleUrl;
