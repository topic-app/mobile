import React from 'react';
import { View, Platform, FlatList } from 'react-native';
import { Divider, Button, RadioButton, List } from 'react-native-paper';

import { Modal } from '@components/index';
import getStyles from '@styles/Styles';
import { ModalProps } from '@ts/types';
import { useTheme } from '@utils/index';

type PlaceType = 'school' | 'place' | 'standalone' | 'online';

type PlaceTypeModalProps = ModalProps & { next: (type: PlaceType) => void };

function PlaceTypeModal({ visible, setVisible, next }: PlaceTypeModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [currentType, setCurrentType] = React.useState<PlaceType>('school');

  const placeTypes: { type: PlaceType; title: string; description: string }[] = [
    {
      type: 'school',
      title: 'Établissement',
      description: "L'évènement a lieu dans un établissement scolaire",
    },
    {
      type: 'place',
      title: 'Lieu',
      description: "L'évènement a lieu dans un lieu culturel",
    },
    {
      type: 'standalone',
      title: 'Adresse',
      description: "L'évènement a lieu à une adresse spécifique",
    },
    {
      type: 'online',
      title: 'En ligne',
      description: "L'évènement a lieu en ligne",
    },
  ];

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <FlatList
        data={placeTypes}
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

export default PlaceTypeModal;
