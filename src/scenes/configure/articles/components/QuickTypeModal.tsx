import React from 'react';
import { ModalProps, ArticleListItem } from '@ts/types';
import { Divider, Button, Card, RadioButton, List, useTheme } from 'react-native-paper';
import { View, Platform, FlatList } from 'react-native';
import Modal from 'react-native-modal';

import getStyles from '@styles/Styles';

type QuickTypeModalProps = ModalProps & { next: (type: string) => void };

function QuickTypeModal({ visible, setVisible, next }: QuickTypeModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [currentType, setCurrentType] = React.useState('tag');

  const quickTypes = [
    {
      type: 'tag',
      title: 'Tag',
      description:
        "Pour rassembler des articles traitant d'un certain sujet ou autour d'un certain thème",
    },
    {
      type: 'group',
      title: 'Groupe',
      description: "Pour voir tous les articles écrits par les membres d'un certain groupe",
    },
    {
      type: 'user',
      title: 'Utilisateur',
      description: 'Pour voir tous les articles écrits par un utilisateur',
    },
  ];

  return (
    <Modal
      isVisible={visible}
      avoidKeyboard
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      onSwipeComplete={() => setVisible(false)}
      swipeDirection={['down']}
      style={styles.bottomModal}
    >
      <Card>
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
    </Modal>
  );
}

export default QuickTypeModal;
