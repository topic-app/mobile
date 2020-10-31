import React from 'react';
import { Text, Title, Button } from 'react-native-paper';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';

type UnauthorizedBetaProps = {
  back: () => void;
};

const UnauthorizedBeta: React.FC<UnauthorizedBetaProps> = ({ back }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;
  return (
    <View style={styles.page}>
      <View style={styles.centerIllustrationContainer}>
        <Icon name="close" size={128} color={colors.invalid} />
        <Title>Page désactivée</Title>
        <Text>Vous ne pouvez pas accéder à cette page dans cette version de la bêta :(</Text>
        <View style={styles.container}>
          {back ? (
            <Button mode="outlined" onPress={back}>
              Retour
            </Button>
          ) : (
            <View />
          )}
        </View>
      </View>
    </View>
  );
};

export default UnauthorizedBeta;
