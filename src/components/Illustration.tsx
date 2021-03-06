import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SvgProps } from 'react-native-svg';

import * as Assets from '@assets/index';
import getStyles from '@styles/global';
import { logger } from '@utils';

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

type Props = SvgProps & { name: IllustrationName; label?: string; centered?: boolean };

const Illustration: React.FC<Props> = ({
  name,
  height = 200,
  width = 200,
  centered = false,
  label,
  ...rest
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  if (!(name in illustrations)) {
    logger.warn(`Error: ${name} not found in list of artwork`);
    return null;
  }

  const item = illustrations[name];
  const IllustrationComponent = item.all || (theme.dark ? item.dark : item.light);

  if (IllustrationComponent) {
    return (
      <View
        accessibilityLabel={label}
        accessibilityElementsHidden={!label}
        importantForAccessibility={label ? undefined : 'no-hide-descendants'}
        aria-hidden={!label}
        style={centered && styles.centerIllustrationContainer}
      >
        <IllustrationComponent height={height} width={width} {...rest} />
      </View>
    );
  }

  return null;
};

export default Illustration;
