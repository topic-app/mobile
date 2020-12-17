import React from 'react';
import { View, Platform } from 'react-native';
import { Divider, Button, HelperText, TextInput as PaperTextInput } from 'react-native-paper';
import { connect } from 'react-redux';

import { Modal } from '@components/index';
import { fetchGroup } from '@redux/actions/api/groups';
import { groupModify } from '@redux/actions/apiActions/groups';
import getStyles from '@styles/Styles';
import { ModalProps, State, Group, GroupPreload } from '@ts/types';
import { useTheme } from '@utils/index';

import getArticleStyles from '../styles/Styles';

type EditGroupModalProps = ModalProps & {
  group: Group | GroupPreload | null;
  editingGroup: {
    shortName?: string;
    summary?: string;
    description?: string;
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

const EditGroupModal: React.FC<EditGroupModalProps> = ({
  visible,
  setVisible,
  group,
  editingGroup,
  setEditingGroup,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [errorVisible, setErrorVisible] = React.useState(false);

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View style={articleStyles.activeCommentContainer}>
          <PaperTextInput mode="outlined" label="Nom" disabled value={group?.name} />
          <HelperText type="info">
            Pour des raisons de sécurité, nous n&amp;autorisons pas le changement de nom. Envoyez un
            email à moderation@topicapp.fr si vous voulez changer
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
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { groups } = state;
  return {
    state: groups.state,
  };
};

export default connect(mapStateToProps)(EditGroupModal);
