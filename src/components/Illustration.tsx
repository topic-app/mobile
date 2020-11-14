import React from 'react';
import { Platform } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { Config } from '@constants/index';
import { useTheme, logger } from '@utils/index';

// Topic Icon
import TopicIcon from '@assets/images/topic-icon.svg';

// Article Illustrations
import ArticleCompletedLight from '@assets/images/illustrations/articles/articles_completed_light.svg';
import ArticleCompletedDark from '@assets/images/illustrations/articles/articles_completed_dark.svg';
import ArticleLight from '@assets/images/illustrations/articles/articles_light.svg';
import ArticleDark from '@assets/images/illustrations/articles/articles_dark.svg';
import ArticleGreyedLight from '@assets/images/illustrations/articles/articles_greyed_light.svg';
import ArticleGreyedDark from '@assets/images/illustrations/articles/articles_greyed_dark.svg';
import ArticleListsLight from '@assets/images/illustrations/articles/articles_lists_light.svg';
import ArticleListsDark from '@assets/images/illustrations/articles/articles_lists_dark.svg';

// Auth Illustrations
import AuthLoginLight from '@assets/images/illustrations/auth/login_light.svg';
import AuthLoginDark from '@assets/images/illustrations/auth/login_dark.svg';
import AuthRegisterLight from '@assets/images/illustrations/auth/register_light.svg';
import AuthRegisterDark from '@assets/images/illustrations/auth/register_dark.svg';
import AuthRegisterSuccessLight from '@assets/images/illustrations/auth/register_success_light.svg';
import AuthRegisterSuccessDark from '@assets/images/illustrations/auth/register_success_dark.svg';

// Comment Illustrations
import CommentEmptyLight from '@assets/images/illustrations/comments/comments_empty_light.svg';
import CommentEmptyDark from '@assets/images/illustrations/comments/comments_empty_dark.svg';

// Configure Illustrations
import ConfigureLight from '@assets/images/illustrations/configure/configure_light.svg';
import ConfigureDark from '@assets/images/illustrations/configure/configure_dark.svg';

// Event Illustrations
import EventLight from '@assets/images/illustrations/events/events_light.svg';
import EventDark from '@assets/images/illustrations/events/events_dark.svg';
import EventGreyedLight from '@assets/images/illustrations/events/events_greyed_light.svg';
import EventGreyedDark from '@assets/images/illustrations/events/events_greyed_dark.svg';

// Explore Illustrations
import ExploreLight from '@assets/images/illustrations/explore/explore_light.svg';
import ExploreDark from '@assets/images/illustrations/explore/explore_dark.svg';
import ExploreGreyedLight from '@assets/images/illustrations/explore/explore_greyed_light.svg';
import ExploreGreyedDark from '@assets/images/illustrations/explore/explore_greyed_dark.svg';

// Group Illustrations
import GroupLight from '@assets/images/illustrations/groups/groups_light.svg';
import GroupDark from '@assets/images/illustrations/groups/groups_dark.svg';

// Group Illustrations
import TagLight from '@assets/images/illustrations/tags/tags_light.svg';
import TagDark from '@assets/images/illustrations/tags/tags_dark.svg';

// Petition Illustrations
import PetitionLight from '@assets/images/illustrations/petitions/petitions_light.svg';
import PetitionDark from '@assets/images/illustrations/petitions/petitions_dark.svg';
import PetitionGreyedLight from '@assets/images/illustrations/petitions/petitions_greyed_light.svg';
import PetitionGreyedDark from '@assets/images/illustrations/petitions/petitions_greyed_dark.svg';

// Select Location Illustrations
import LocationSelectLight from '@assets/images/illustrations/select_location/select_location_light.svg';
import LocationSelectDark from '@assets/images/illustrations/select_location/select_location_dark.svg';

// Settings Illustrations
import SettingsThemeAll from '@assets/images/illustrations/settings/settings_theme_all.svg';
import SettingsPrivacyLight from '@assets/images/illustrations/settings/settings_privacy_light.svg';
import SettingsPrivacyDark from '@assets/images/illustrations/settings/settings_privacy_dark.svg';

// Search illustratinos
import SearchLight from '@assets/images/illustrations/search/search_light.svg';
import SearchDark from '@assets/images/illustrations/search/search_dark.svg';

const illustrationList = {
  // Topic Icon
  'topic-icon': {
    light: TopicIcon,
    dark: TopicIcon,
  },

  // Article Illustrations
  article: {
    light: ArticleLight,
    dark: ArticleDark,
  },
  'article-greyed': {
    light: ArticleGreyedLight,
    dark: ArticleGreyedDark,
  },
  'article-completed': {
    light: ArticleCompletedLight,
    dark: ArticleCompletedDark,
  },
  'article-lists': {
    light: ArticleListsLight,
    dark: ArticleListsDark,
  },

  // Auth Illustrations
  'auth-login': {
    light: AuthLoginLight,
    dark: AuthLoginDark,
  },
  'auth-register': {
    light: AuthRegisterLight,
    dark: AuthRegisterDark,
  },
  'auth-register-success': {
    light: AuthRegisterSuccessLight,
    dark: AuthRegisterSuccessDark,
  },

  // Comment Illustrations
  'comment-empty': {
    light: CommentEmptyLight,
    dark: CommentEmptyDark,
  },

  // Configure Illustrations
  configure: {
    light: ConfigureLight,
    dark: ConfigureDark,
  },

  // Event Illustrations
  event: {
    light: EventLight,
    dark: EventDark,
  },
  'event-greyed': {
    light: EventGreyedLight,
    dark: EventGreyedDark,
  },

  // Explore Illustrations
  explore: {
    light: ExploreLight,
    dark: ExploreDark,
  },
  'explore-greyed': {
    light: ExploreGreyedLight,
    dark: ExploreGreyedDark,
  },

  // Group Illustrations
  group: {
    light: GroupLight,
    dark: GroupDark,
  },

  // Tag Illustrations
  tag: {
    light: TagLight,
    dark: TagDark,
  },

  // User Illustrations TEMP: Find a better illustration
  user: {
    light: GroupLight,
    dark: GroupDark,
  },

  // Petition Illustrations
  petition: {
    light: PetitionLight,
    dark: PetitionDark,
  },
  'petition-greyed': {
    light: PetitionGreyedLight,
    dark: PetitionGreyedDark,
  },

  // Select Location
  'location-select': {
    light: LocationSelectLight,
    dark: LocationSelectDark,
  },

  // Settings Illustrations
  'settings-theme': {
    light: SettingsThemeAll,
    dark: SettingsThemeAll,
  },
  'settings-privacy': {
    light: SettingsPrivacyLight,
    dark: SettingsPrivacyDark,
  },

  // Search illustrations
  search: {
    light: SearchLight,
    dark: SearchDark,
  },
};

type Props = SvgProps & { name: keyof typeof illustrationList };

const Illustration: React.FC<Props> = ({ name, ...rest }) => {
  const { dark } = useTheme();

  if (Platform.OS === 'web' || Config.dev.hideSvg) return null;

  const Item = dark ? illustrationList[name]?.dark : illustrationList[name]?.light;

  if (!Item) {
    logger.warn(`Error: ${name} not found in list of artwork`);
    return null;
  }

  return <Item {...rest} />;
};

export default Illustration;
