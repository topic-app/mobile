import PropTypes from 'prop-types';
import { contentPropType } from './common';
import { imagePropType } from './image';
import { locationPropType } from './location';

const groupPropType = {
  _id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  image: imagePropType,
};

const groupInfoPropType = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  summary: PropTypes.string,
  type: PropTypes.string.isRequired,
  image: imagePropType,
  description: contentPropType.isRequired,
  location: locationPropType.isRequired,
  cache: PropTypes.shape({
    followers: PropTypes.number,
    members: PropTypes.number,
  }).isRequired,
};

export { groupPropType, groupInfoPropType };
