import { Publisher, AuthorPreload, GroupPreload, TagPreload, Location, Avatar } from '@ts/types';
import { getImageUrl } from './getAssetUrl';

export type ItemData = {
  publisher?: Publisher;
  authors?: AuthorPreload[];
  group?: GroupPreload;
  tags?: TagPreload[];
  location?: Location;
};

type TagData = {
  key: string;
  type: 'group' | 'author' | 'tag' | 'global' | 'school' | 'department';
  label: string;
  avatar?: Avatar;
  image?: string;
  icon?: string;
  color?: string;
};

function genTagListData({ publisher, authors, group, tags, location }: ItemData) {
  const data: TagData[] = [];

  if (publisher) {
    if (publisher.type === 'group' && publisher.group) {
      data.push({
        key: publisher.group._id,
        type: 'group',
        label: publisher.group.displayName,
        // avatar: publisher.group.avatar,
        image: getImageUrl({ image: group?.avatar?.image, size: 'small' }),
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
      image: getImageUrl({ image: group?.avatar?.image, size: 'small' }),
      // avatar: group.avatar,
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
        label: school.displayName,
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
