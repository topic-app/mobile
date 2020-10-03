import React from 'react';
import { ModalProps, ArticleListItem } from '@ts/types';
import {
  Divider,
  Button,
  Card,
  RadioButton,
  ThemeProvider,
  List,
  useTheme,
} from 'react-native-paper';
import { View, Platform, FlatList } from 'react-native';
import Modal, { BottomModal, SlideAnimation } from '@components/Modals';

import getStyles from '@styles/Styles';

type QuickTypeModalProps = ModalProps & {
  next: (type: string) => void;
  type: 'articles' | 'events';
};

function QuickTypeModal({ visible, setVisible, next, type }: QuickTypeModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const contentName = type === 'articles' ? 'Articles' : 'Évènements';

  const [currentType, setCurrentType] = React.useState('tag');

  const quickTypes = [
    {
      type: 'tag',
      title: 'Tag',
      description: `${contentName} traitant d'un certain sujet ou autour d'un certain thème`,
    },
    {
      type: 'group',
      title: 'Groupe',
      description: `${contentName} écrits par les membres d'un certain groupe`,
    },
    {
      type: 'user',
      title: 'Utilisateur',
      description: `${contentName} écrits par un utilisateur`,
    },
    {
      type: 'location',
      title: 'Localisation',
      description: `${contentName} destinés à une école, à un département, ou à une région`,
    },
  ];

  return (
    <BottomModal
      visible={visible}
      onTouchOutside={() => {
        setVisible(false);
      }}
      onHardwareBackPress={() => {
        setVisible(false);
        return true;
      }}
      onSwipeOut={() => {
        setVisible(false);
      }}
      modalAnimation={
        new SlideAnimation({
          slideFrom: 'bottom',
          useNativeDriver: false,
        })
      }
    >
      <ThemeProvider theme={theme}>
        <Card style={styles.modalCard}>
          <FlatList
            data={quickTypes}
            renderItem={({ item }) => {
              return (
                <View>
                  <List.Item
                    title={item.title}
                    description={item.description}
                    onPress={() => {
                      setCurrentType(item.type);
                    }}
                    left={() =>
                      Platform.OS !== 'ios' && (
                        <RadioButton
                          color={colors.primary}
                          status={item.type === currentType ? 'checked' : 'unchecked'}
                          onPress={() => {
                            setCurrentType(item.type);
                          }}
                        />
                      )
                    }
                    right={() =>
                      Platform.OS === 'ios' && (
                        <RadioButton
                          color={colors.primary}
                          status={item.type === currentType ? 'checked' : 'unchecked'}
                          onPress={() => {
                            setCurrentType(item.type);
                          }}
                        />
                      )
                    }
                  />
                  <Divider />
                </View>
              );
            }}
            ListFooterComponent={() => {
              return (
                <View>
                  <View style={styles.contentContainer}>
                    <Button
                      mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                      color={colors.primary}
                      uppercase={Platform.OS !== 'ios'}
                      onPress={() => next(currentType)}
                      style={{ flex: 1 }}
                    >
                      Suivant
                    </Button>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item) => item.type}
          />
        </Card>
      </ThemeProvider>
    </BottomModal>
  );
}

export default QuickTypeModal;
