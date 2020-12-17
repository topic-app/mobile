import React from 'react';
import { View, Platform, FlatList } from 'react-native';
import { Divider, Button, RadioButton, List } from 'react-native-paper';

import { Modal } from '@components/index';
import getStyles from '@styles/Styles';
import { ModalProps } from '@ts/types';
import { useTheme } from '@utils/index';

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
      description: `${contentName} destinés à une école, à un département ou à une région`,
    },
  ];

  return (
    <Modal visible={visible} setVisible={setVisible}>
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
                      value=""
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
                      value=""
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
    </Modal>
  );
}

export default QuickTypeModal;
