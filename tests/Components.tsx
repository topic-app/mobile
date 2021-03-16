import React from 'react';
import renderer from 'react-test-renderer';

import { Avatar } from '@components';

test('avatar renders correctly', () => {
  const tree = renderer.create(<Avatar name="Jason McDuck" />).toJSON();
  expect(tree).toMatchSnapshot();
});
