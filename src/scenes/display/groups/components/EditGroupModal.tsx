import React from 'react';
import { ModalProps, State, ArticleListItem, Group } from '@ts/types';
import {
  Divider,
  Button,
  HelperText,
  TextInput as PaperTextInput,
  Card,
  ThemeProvider,
  useTheme,
} from 'react-native-paper';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';
import Modal, { BottomModal, SlideAnimation } from 'react-native-modals';

import { CollapsibleView } from '@components/index';
import getStyles from '@styles/Styles';
import { groupModify } from '@redux/actions/apiActions/groups';
import { fetchGroup } from '@redux/actions/api/groups';
import getArticleStyles from '../styles/Styles';

type EditModalProps = ModalProps & {
  group: Group | null;
  editingGroup: {
    shortName: string;
    summary: string;
    description: string;
  } | null;
  setEditingGroup: ({
    shortName,
    summary,
    description,
  }: {
    shortName?: string;
    summary?: string;
    description?: string;
  }) => any;
};

function EditModal({ visible, setVisible, group, editingGroup, setEditingGroup }: EditModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [errorVisible, setErrorVisible] = React.useState(false);

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
          <View>
            <View style={articleStyles.activeCommentContainer}>
              <PaperTextInput mode="outlined" label="Nom" disabled value={group?.name} />
              <HelperText type="info">
                Pour des raisons de sécurité, nous n'autorisons pas le changement de nom. Envoyez un
                message à moderation@topicapp.fr si vous voulez changer
              </HelperText>
            </View>
            <View style={articleStyles.activeCommentContainer}>
              <PaperTextInput
                mode="outlined"
                autoFocus
                label="Acronyme"
                value={editingGroup?.shortName}
                onChangeText={(text) => {
                  setEditingGroup({ ...editingGroup, shortName: text });
                }}
              />
              <HelperText type="info">
                Un nom reconnaissable qui sera affiché en priorité (facultatif)
              </HelperText>
            </View>
            <Divider style={{ marginTop: 10 }} />
            <View style={styles.contentContainer}>
              <Button
                mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                color={colors.primary}
                uppercase={Platform.OS !== 'ios'}
                onPress={() => {
                  if (group) {
                    groupModify(group?._id, {
                      shortName: editingGroup?.shortName,
                    }).then(() => {
                      fetchGroup(group?._id);
                      setVisible(false);
                    });
                  }
                }}
              >
                Mettre à jour
              </Button>
            </View>
          </View>
        </Card>
      </ThemeProvider>
    </BottomModal>
  );
}

const mapStateToProps = (state: State) => {
  const { groups } = state;
  return {
    state: groups.state,
  };
};

export default connect(mapStateToProps)(EditModal);
