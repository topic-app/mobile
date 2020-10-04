import React from 'react';
import { ModalProps, ArticleListItem, ArticleQuickItem, State } from '@ts/types';
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

import { Modal } from '@components/index';
import getStyles from '@styles/Styles';
import { connect } from 'react-redux';

type QuickTypeModalProps = ModalProps & {
  next: (type: string) => void;
  articleQuicks: ArticleQuickItem[];
};

function QuickTypeModal({ visible, setVisible, next, articleQuicks }: QuickTypeModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [currentType, setCurrentType] = React.useState('school');

  if (currentType === 'global' && articleQuicks?.some((q) => q.type === 'global')) {
    setCurrentType('school');
  }

  const quickTypes = [
    {
      type: 'school',
      title: 'École',
    },
    {
      type: 'departement',
      title: 'Département',
    },
    {
      type: 'region',
      title: 'Région',
    },
    {
      type: 'global',
      title: 'France entière',
      disabled: articleQuicks?.some((q) => q.type === 'global'),
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
                onPress={
                  item.disabled
                    ? undefined
                    : () => {
                        setCurrentType(item.type);
                      }
                }
                titleStyle={item.disabled ? { color: colors.disabled } : {}}
                left={() =>
                  Platform.OS !== 'ios' && (
                    <RadioButton
                      disabled={item.disabled}
                      color={colors.primary}
                      status={item.type === currentType ? 'checked' : 'unchecked'}
                      onPress={
                        item.disabled
                          ? undefined
                          : () => {
                              setCurrentType(item.type);
                            }
                      }
                    />
                  )
                }
                right={() =>
                  Platform.OS === 'ios' && (
                    <RadioButton
                      disabled={item.disabled}
                      color={colors.primary}
                      status={item.type === currentType ? 'checked' : 'unchecked'}
                      onPress={
                        item.disabled
                          ? undefined
                          : () => {
                              setCurrentType(item.type);
                            }
                      }
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

const mapStateToProps = (state: State) => {
  const { articleData } = state;
  return { articleQuicks: articleData.quicks };
};

export default connect(mapStateToProps)(QuickTypeModal);
