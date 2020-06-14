import PropTypes from 'prop-types';
import { globalDatePropType, contentPropType, tagPopulatedPropType } from './common';
import { groupPropType } from './group';
import { authorPropType } from './user';
import { imagePropType } from './image';

const articleInfoPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: globalDatePropType.isRequired,
  summary: PropTypes.string.isRequired,
  content: contentPropType.isRequired,
  image: imagePropType,
  author: authorPropType.isRequired,
  group: groupPropType.isRequired,
  tags: PropTypes.arrayOf(tagPopulatedPropType).isRequired,
});

const articleListPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: globalDatePropType.isRequired,
  summary: PropTypes.string.isRequired,
  image: imagePropType,
  author: authorPropType.isRequired,
  group: groupPropType.isRequired,
  tags: PropTypes.arrayOf(tagPopulatedPropType).isRequired,
});

export { articleListPropType, articleInfoPropType };
