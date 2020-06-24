import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import CustomTabView from '@components/CustomTabView';
import getStyles from '@styles/Styles';

function About({ navigation }) {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.page}>
      <ScrollView>
        <CustomTabView
          scrollEnabled={false}
          pages={[
            {
              key: 'about',
              title: 'A propos',
              component: (
                <View>
                  <Text>Test</Text>
                </View>
              ),
            },
            {
              key: 'sponsors',
              title: 'Sponsors',
              component: <Text>Hello again</Text>,
            },
            {
              key: 'Licenses',
              title: 'Licenses',
              component: <Text>Test hello 3</Text>,
            },
          ]}
        />
      </ScrollView>
    </View>
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
