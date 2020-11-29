import React from 'react';
import { View, Platform } from 'react-native';
import {
  Divider,
  Button,
  HelperText,
  TextInput as PaperTextInput,
  ProgressBar,
} from 'react-native-paper';
import { connect } from 'react-redux';

import { ErrorMessage, Modal } from '@components/index';
import { fetchGroup } from '@redux/actions/api/groups';
import { groupModify } from '@redux/actions/apiActions/groups';
import getStyles from '@styles/Styles';
import { ModalProps, State, Group, GroupRequestState, GroupPreload } from '@ts/types';
import { useTheme } from '@utils/index';

import getArticleStyles from '../styles/Styles';

type EditGroupDescriptionModalProps = ModalProps & {
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
  state: GroupRequestState;
};

const EditGroupDescriptionModal: React.FC<EditGroupDescriptionModalProps> = ({
  visible,
  setVisible,
  group,
  editingGroup,
  setEditingGroup,
  state,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [errorVisible, setErrorVisible] = React.useState(false);

  const add = () => {
    if (group) {
      groupModify(group?._id, {
        summary: editingGroup?.summary,
        description: { parser: 'markdown', data: editingGroup?.description || '' },
      }).then(() => {
        fetchGroup(group?._id);
        setVisible(false);
      });
    }
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        {state.modify?.loading && <ProgressBar indeterminate style={{ marginTop: -4 }} />}
        {state.modify?.error ? (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la modification du groupe',
              contentSingular: 'Le groupe',
            }}
            error={state.modify?.error}
            retry={add}
          />
        ) : null}
        <View>
          <View style={articleStyles.activeCommentContainer}>
            <PaperTextInput
              mode="outlined"
              multiline
              label="Résumé"
              value={editingGroup?.summary}
              onChangeText={(text) => {
                setEditingGroup({ ...editingGroup, summary: text });
              }}
            />
            <HelperText type="info">Décrivez ce que vous faites en une ou deux lignes</HelperText>
          </View>
          <View style={articleStyles.activeCommentContainer}>
            <PaperTextInput
              mode="outlined"
              label="Description"
              multiline
              numberOfLines={5}
              value={editingGroup?.description}
              onChangeText={(text) => {
                setEditingGroup({ ...editingGroup, description: text });
              }}
            />
            <HelperText type="info">
              Présentez votre groupe, ce que vous faites, sans limite de taille.
            </HelperText>
          </View>
          <Divider style={{ marginTop: 10 }} />
          <View style={styles.contentContainer}>
            <Button
              mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
              color={colors.primary}
              uppercase={Platform.OS !== 'ios'}
              onPress={add}
            >
              Mettre à jour
            </Button>
          </View>
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

export default connect(mapStateToProps)(EditGroupDescriptionModal);
