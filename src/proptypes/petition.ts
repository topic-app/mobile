import PropTypes from 'prop-types';
import { contentPropType, durationPropType, tagPopulatedPropType } from './common';
import { userPropType } from './user';
import { imagePropType } from './image';
import { locationPropType } from './location';
import { groupPropType } from './group';

const petitionCachePropType = PropTypes.shape({
  multiple: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      votes: PropTypes.number,
    }),
  ),
  double: PropTypes.shape({
    for: PropTypes.number,
    against: PropTypes.number,
  }),
  signatures: PropTypes.number,
  goals: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number, // Do I add a title to the goals? Also, shoul I make this an array?
    }),
  ),
  followers: PropTypes.number,
});

const petitionInfoPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  description: contentPropType,
  image: imagePropType,
  type: PropTypes.oneOf(['goal', 'sign', 'opinion', 'multiple']).isRequired,
  status: PropTypes.oneOf(['open', 'waiting', 'answered', 'rejected']).isRequired,
  duration: durationPropType.isRequired,
  location: locationPropType.isRequired,
  publisher: PropTypes.shape({
    type: PropTypes.oneOf(['user', 'group']).isRequired,
    user: userPropType,
    group: groupPropType,
  }).isRequired,
  tags: PropTypes.arrayOf(tagPopulatedPropType).isRequired,
  cache: petitionCachePropType.isRequired,
});

const petitionListPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['goal', 'sign', 'opinion', 'multiple']).isRequired,
  status: PropTypes.oneOf(['open', 'waiting', 'answered', 'rejected']).isRequired,
  duration: durationPropType.isRequired,
  location: locationPropType.isRequired,
  publisher: PropTypes.shape({
    type: PropTypes.oneOf(['user', 'group']).isRequired,
    user: userPropType,
    group: groupPropType,
  }).isRequired,
  tags: PropTypes.arrayOf(tagPopulatedPropType).isRequired,
  cache: petitionCachePropType.isRequired,
});

export { petitionListPropType, petitionInfoPropType };
