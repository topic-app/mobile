import * as Assets from '@assets/index';
import React from 'react';
import { SvgProps } from 'react-native-svg';

import { useTheme, logger } from '@utils';

const illustrationList = {
  // Topic Icon
  'topic-icon': {
    all: Assets.TopicIcon,
  },
  'topic-icon-text': {
    light: Assets.TopicIconTextLight,
    dark: Assets.TopicIconTextDark,
  },

  // Article Illustrations
  article: {
    light: Assets.ArticleLight,
    dark: Assets.ArticleDark,
  },
  'article-greyed': {
    light: Assets.ArticleGreyedLight,
    dark: Assets.ArticleGreyedDark,
  },
  'article-completed': {
    light: Assets.ArticleCompletedLight,
    dark: Assets.ArticleCompletedDark,
  },
  'article-lists': {
    light: Assets.ArticleListsLight,
    dark: Assets.ArticleListsDark,
  },

  // Auth Illustrations
  'auth-login': {
    light: Assets.AuthLoginLight,
    dark: Assets.AuthLoginDark,
  },
  'auth-register': {
    light: Assets.AuthRegisterLight,
    dark: Assets.AuthRegisterDark,
  },
  'auth-register-success': {
    light: Assets.AuthRegisterSuccessLight,
    dark: Assets.AuthRegisterSuccessDark,
  },

  // Comment Illustrations
  'comment-empty': {
    light: Assets.CommentEmptyLight,
    dark: Assets.CommentEmptyDark,
  },

  // Configure Illustrations
  configure: {
    light: Assets.ConfigureLight,
    dark: Assets.ConfigureDark,
  },

  // Event Illustrations
  event: {
    light: Assets.EventLight,
    dark: Assets.EventDark,
  },
  'event-greyed': {
    light: Assets.EventGreyedLight,
    dark: Assets.EventGreyedDark,
  },

  // Explore Illustrations
  explore: {
    light: Assets.ExploreLight,
    dark: Assets.ExploreDark,
  },
  'explore-greyed': {
    light: Assets.ExploreGreyedLight,
    dark: Assets.ExploreGreyedDark,
  },

  // Group Illustrations
  group: {
    light: Assets.GroupLight,
    dark: Assets.GroupDark,
  },

  // Tag Illustrations
  tag: {
    light: Assets.TagLight,
    dark: Assets.TagDark,
  },

  // User Illustrations TEMP: Find a better illustration
  user: {
    light: Assets.GroupLight,
    dark: Assets.GroupDark,
  },

  // Petition Illustrations
  petition: {
    light: Assets.PetitionLight,
    dark: Assets.PetitionDark,
  },
  'petition-greyed': {
    light: Assets.PetitionGreyedLight,
    dark: Assets.PetitionGreyedDark,
  },

  // Select Location
  'location-select': {
    light: Assets.LocationSelectLight,
    dark: Assets.LocationSelectDark,
  },

  // Settings Illustrations
  'settings-theme': {
    all: Assets.SettingsThemeAll,
  },
  'settings-privacy': {
    light: Assets.SettingsPrivacyLight,
    dark: Assets.SettingsPrivacyDark,
  },

  // Search illustrations
  search: {
    light: Assets.SearchLight,
    dark: Assets.SearchDark,
  },

  // Beta illustrations
  'beta-welcome': {
    all: Assets.BetaWelcomeAll,
  },
  'beta-privacy': {
    all: Assets.BetaPrivacyAll,
  },
  'beta-bugs': {
    all: Assets.BetaBugsAll,
  },
  'beta-messages': {
    all: Assets.BetaMessagesAll,
  },
  'beta-updates': {
    all: Assets.BetaUpdatesAll,
  },
  empty: {
    all: Assets.ErrorsEmptyAll,
  },

  // Misc illustrations
  telegram: {
    all: Assets.Telegram,
  },
};

// Re-define illustrations as an object with optional properties
const illustrations: {
  [key in IllustrationName]: { all?: any; dark?: any; light?: any };
} = illustrationList;

export type IllustrationName = keyof typeof illustrationList;

type Props = SvgProps & { name: IllustrationName };

const Illustration: React.FC<Props> = ({ name, height = 200, width = 200, ...rest }) => {
  const { dark } = useTheme();

  if (!(name in illustrations)) {
    logger.warn(`Error: ${name} not found in list of artwork`);
    return null;
  }

  const item = illustrations[name];
  const IllustrationComponent = item.all || (dark ? item.dark : item.light);

  if (IllustrationComponent) {
    return <IllustrationComponent height={height} width={width} {...rest} />;
  }

  return null;
};

export default Illustration;
