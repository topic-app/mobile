import PropTypes from 'prop-types';

const imagePropType = PropTypes.shape({
  image: PropTypes.string.isRequired,
  thumbnails: PropTypes.shape({
    small: false,
    medium: false,
    large: false,
  }).isRequired,
});

// eslint-disable-next-line import/prefer-default-export
export { imagePropType };
