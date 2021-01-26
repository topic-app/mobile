import { Publisher, AuthorPreload, GroupPreload, TagPreload, Location, Avatar } from '@ts/types';

import { getImageUrl } from './getAssetUrl';

export type ItemData = {
  publisher?: Publisher;
  authors?: AuthorPreload[];
  group?: GroupPreload;
  tags?: TagPreload[];
  location?: Location;
  cache?: { likes?: number };
  opinion?: boolean;
};

type TagData = {
  key: string;
  type: 'group' | 'author' | 'tag' | 'likes' | 'global' | 'school' | 'department' | 'opinion';
  label: string;
  avatar?: Avatar;
  image?: string;
  icon?: string;
  color?: string;
};

function genTagListData({ cache, publisher, authors, group, tags, location, opinion }: ItemData) {
  const data: TagData[] = [];

  if (publisher) {
    if (publisher.type === 'group' && publisher.group) {
      data.push({
        key: publisher.group._id,
        type: 'group',
        label: publisher.group.displayName,
        image:
          group?.avatar?.type === 'image'
            ? getImageUrl({ image: group.avatar?.image, size: 'small' })
            : undefined,
        icon: 'newspaper',
      });
    } else if (publisher.type === 'group' && publisher.user) {
      data.push({
        key: publisher.user._id,
        type: 'author',
        label: publisher.user.displayName,
        icon: 'account',
      });
    }
  }

  if (group) {
    data.push({
      key: group._id,
      type: 'group',
      label: group.displayName,
      image:
        group.avatar?.type === 'image'
          ? getImageUrl({ image: group.avatar?.image, size: 'small' })
          : undefined,
      icon: 'newspaper',
    });
  }

  if (authors) {
    authors.forEach((author) =>
      data.push({
        key: author._id,
        type: 'author',
        label: author.displayName,
        icon: 'account',
      }),
    );
  }

  if (opinion) {
    data.push({
      key: 'opinion',
      type: 'opinion',
      label: 'Opinion',
      icon: 'format-quote-open',
    });
  }

  if (tags) {
    tags.forEach((tag) =>
      data.push({
        key: tag._id,
        type: 'tag',
        label: tag.displayName,
        color: tag.color,
        icon: 'pound',
      }),
    );
  }

  if (cache && cache.likes) {
    data.push({
      key: 'likes',
      type: 'likes',
      label: cache.likes.toString(),
      icon: 'thumb-up-outline',
    });
  }

  if (location) {
    if (location.global) {
      data.push({
        key: 'location-global',
        type: 'global',
        label: 'France',
        icon: 'map-marker',
      });
    }

    location.schools.forEach((school) =>
      data.push({
        key: school._id,
        type: 'school',
        label: school.name,
        icon: 'map-marker',
      }),
    );

    location.departments.forEach((department) =>
      data.push({
        key: department._id,
        type: 'department',
        label: department.displayName,
        icon: 'map-marker',
      }),
    );
  }
  return data;
}

export { genTagListData };
