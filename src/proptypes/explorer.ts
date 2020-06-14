import PropTypes from 'prop-types';
import { contentPropType } from './common';
import { addressPropType } from './location';
import { imagePropType } from './image';

const explorerInfoPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  image: imagePropType,
  type: PropTypes.oneOf(['event', 'school', 'museum']).isRequired,
  location: addressPropType.isRequired,
  content: contentPropType,
});

const explorerListPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['event', 'school', 'museum']).isRequired,
  coordinates: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  }).isRequired,
});

export { explorerListPropType, explorerInfoPropType };
