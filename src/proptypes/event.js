import PropTypes from 'prop-types';
import { contentPropType, durationPropType, socialPropType, tagPopulatedPropType } from './common';
import { groupPropType } from './group';
import { userPropType, authorPropType, memberPropType } from './user';
import { placePropType } from './location';
import { imagePropType } from './image';

const eventEntryPropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  duration: durationPropType.isRequired,
});

const eventInfoPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  content: contentPropType.isRequired,
  image: imagePropType,
  group: groupPropType.isRequired,
  author: authorPropType.isRequired,
  members: PropTypes.arrayOf(memberPropType).isRequired,
  tags: PropTypes.arrayOf(tagPopulatedPropType).isRequired,
  duration: durationPropType.isRequired,
  program: PropTypes.arrayOf(eventEntryPropType).isRequired,
  places: PropTypes.arrayOf(placePropType).isRequired,
  contact: PropTypes.shape({
    user: userPropType.isRequired,
    email: PropTypes.string,
    phone: PropTypes.string,
    social: socialPropType.isRequired,
    other: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string, value: PropTypes.string })),
  }).isRequired,
  cache: PropTypes.shape({
    followers: PropTypes.number.isRequired,
  }).isRequired,
});

const eventListPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  image: imagePropType,
  group: groupPropType.isRequired,
  author: authorPropType.isRequired,
  tags: PropTypes.arrayOf(tagPopulatedPropType).isRequired,
  duration: durationPropType.isRequired,
  places: PropTypes.arrayOf(placePropType).isRequired,
  cache: PropTypes.shape({
    followers: PropTypes.number.isRequired,
  }).isRequired,
});

export { eventListPropType, eventInfoPropType };
