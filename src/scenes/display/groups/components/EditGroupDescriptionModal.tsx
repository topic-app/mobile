import React from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import {
  Divider,
  Button,
  HelperText,
  TextInput as PaperTextInput,
  ProgressBar,
  Title,
} from 'react-native-paper';
import { connect } from 'react-redux';

import { ErrorMessage, Modal, Avatar } from '@components/index';
import { fetchGroup } from '@redux/actions/api/groups';
import { groupModify } from '@redux/actions/apiActions/groups';
import { upload } from '@redux/actions/apiActions/upload';
import getStyles from '@styles/Styles';
import {
  ModalProps,
  State,
  Group,
  GroupRequestState,
  GroupPreload,
  Avatar as AvatarType,
  UploadRequestState,
} from '@ts/types';
import { Errors, useTheme } from '@utils/index';

import getArticleStyles from '../styles/Styles';

type EditGroupDescriptionModalProps = ModalProps & {
  group: Group | GroupPreload | null;
  editingGroup: {
    id?: string;
    name?: string;
    summary?: string;
    description?: string;
    avatar?: AvatarType;
  } | null;
  setEditingGroup: ({
    id,
    name,
    summary,
    description,
    avatar,
  }: {
    id?: string;
    name?: string;
    summary?: string;
    description?: string;
    avatar?: AvatarType;
  }) => any;
  state: GroupRequestState;
  uploadState: UploadRequestState;
};

const EditGroupDescriptionModal: React.FC<EditGroupDescriptionModalProps> = ({
  visible,
  setVisible,
  group,
  editingGroup,
  setEditingGroup,
  state,
  uploadState,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [errorVisible, setErrorVisible] = React.useState(false);

  const uploadImage = () => upload(editingGroup?.id || '', 'avatar', true);

  const add = () => {
    if (group) {
      groupModify(group?._id, {
        summary: editingGroup?.summary,
        description: { parser: 'markdown', data: editingGroup?.description || '' },
        avatar: editingGroup?.avatar,
      })
        .then(() => {
          fetchGroup(group?._id);
          setVisible(false);
        })
        .catch((error) =>
          Errors.showPopup({
            type: 'axios',
            what: 'la modification du groupe',
            error,
            retry: add,
          }),
        );
    }
  };

  const editAvatar = () =>
    uploadImage()
      .then((id) => {
        console.log(id);
        setEditingGroup({
          ...editingGroup,
          avatar: {
            type: 'image',
            image: {
              image: id,
              thumbnails: { small: true, medium: false, large: true },
            },
          },
        });
      })
      .catch((error) =>
        Errors.showPopup({
          type: 'axios',
          what: "l'upload de l'image",
          error,
          retry: editAvatar,
        }),
      );

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        {state.modify?.loading && <ProgressBar indeterminate style={{ marginTop: -4 }} />}
        <View>
          <View style={[styles.centerIllustrationContainer, styles.container, { marginTop: 30 }]}>
            <Title>{editingGroup?.name}</Title>
          </View>
          <View
            style={[
              styles.centerIllustrationContainer,
              {
                marginBottom: 120,
                marginTop: 20,
              },
            ]}
          >
            {uploadState.upload?.loading ? (
              <View style={{ height: 120, alignContent: 'center', flex: 1 }}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              <Avatar
                size={120}
                imageSize="large"
                avatar={editingGroup?.avatar}
                onPress={editAvatar}
                editing
              />
            )}
          </View>
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
  const { groups, upload } = state;
  return {
    state: groups.state,
    uploadState: upload.state,
  };
};

export default connect(mapStateToProps)(EditGroupDescriptionModal);
