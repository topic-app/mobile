import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import StepperView from '@components/StepperView';
import Test from './Testcp';

function About({ navigation }) {
  return (
    <ScrollView>
      <Text>Test title</Text>
      <StepperView
        pages={[
          {
            key: 'test',
            title: 'Test',
            icon: 'school',
            component: <Test />,
          },
          {
            key: 'test2',
            title: 'Test2',
            icon: 'alert',
            component: <Test />,
          },
          {
            key: 'test3',
            title: 'Test3',
            icon: 'chevron-left',
            component: <Text>Test hello 3</Text>,
          },
        ]}
      />
    </ScrollView>
  );
}

export default About;

About.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    closeDrawer: PropTypes.func,
  }).isRequired,
};
