import { ProcessServerConfigFunction } from 'filepond';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import React from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { Platform, ScrollView, View, Image } from 'react-native';
import ModalComponent from 'react-native-modal';
import { Card, Text, Button, useTheme, ProgressBar, Title } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { Config } from '@constants';
import { updateUploadState, upload } from '@redux/actions/apiActions/upload';
import Store from '@redux/store';
import getStyles from '@styles/global';
import { State, UploadRequestState, Account } from '@ts/types';
import { checkPermission, getImageUrl, trackEvent, Permissions, logger, request } from '@utils';

import ErrorMessage from './ErrorMessage';

type Props = {
  file: string | null;
  setFile: (id: string | null) => void;
  group: string;
  state: UploadRequestState;
  type?: 'content' | 'avatar';
  account: Account;
  title?: string;
  resizeMode: 'content-primary' | 'avatar' | 'content-inline';
};

const FileUpload: React.FC<Props> = ({
  file,
  setFile,
  group,
  title,
  state,
  type = 'content',
  account,
  resizeMode = 'content-primary',
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType,
  );

  return checkPermission(account, {
    permission: Permissions.CONTENT_UPLOAD,
    scope: { groups: [group || ''] },
  }) ? (
    <View style={type === 'avatar' ? { height: 100, width: 100 } : {}}>
      {title ? (
        <View style={[styles.container, styles.centerIllustrationContainer]}>
          <Title style={{ textAlign: 'center' }}>{title}</Title>
        </View>
      ) : null}
      <FilePond
        allowImagePreview
        allowFileSizeValidation
        allowFileTypeValidation
        // @ts-expect-error
        credits={false}
        maxFileSize="5MB"
        acceptedFileTypes={['image/*']}
        allowMultiple={false}
        labelIdle='Déposez une image ici ou <span class="filepond--label-action">choisissez un fichier</span>'
        labelFileLoading="Chargement..."
        labelFileLoadError="Erreur durant le chargement"
        labelFileProcessingError="Erreur durant l'upload"
        labelFileProcessing="Upload en cours..."
        labelFileProcessingComplete="Image ajoutée"
        labelFileProcessingAborted="Upload annulé"
        labelTapToCancel="Cliquez pour annuler"
        labelTapToRetry="Cliquez pour réessayer"
        labelTapToUndo="Cliquez pour supprimer"
        labelMaxFileSizeExceeded="Fichier trop grand"
        labelMaxFileSize="Maximum 5MB"
        labelFileTypeNotAllowed="Ce fichier n'est pas une image"
        fileValidateTypeLabelExpectedTypes="Fichiers autorisés: .jpg, .png"
        stylePanelLayout={type === 'avatar' ? 'circle' : undefined}
        styleLoadIndicatorPosition={type === 'avatar' ? 'center bottom' : undefined}
        styleButtonRemoveItemPosition={type === 'avatar' ? 'center bottom' : undefined}
        onremovefile={() => setFile(null)}
        server={{
          process: ((async (
            fieldName: any,
            file: any,
            metadata: any,
            load: any,
            error: any,
            progress: any,
            abort: any,
            transfer: any,
            options: any,
          ) => {
            updateUploadState({ permission: { loading: true, success: null, error: null } });
            let permission;
            try {
              permission = await request(
                'permission/upload',
                'post',
                {
                  groupId: group,
                },
                true,
              );
            } catch (error) {
              error('Erreur de permission');
              updateUploadState({ permission: { loading: false, success: false, error: true } });
              return;
            }
            updateUploadState({
              permission: { loading: false, success: true, error: null },
              upload: { loading: true, success: null, error: null },
            });
            try {
              logger.debug('Trying image upload');
              const data = new FormData();
              data.append('resizeMode', resizeMode);
              data.append('file', file as any);
              const res = await fetch(Config.cdn.uploadUrl, {
                method: 'POST',
                body: data,
                headers: {
                  Authorization: `Bearer ${permission.data?.token}`,
                },
              });
              const responseJson = await res.json();
              if (!responseJson.error) {
                logger.info(`File ${responseJson.fileId} uploaded`);
                setFile(responseJson.fileId);
                load(responseJson.fileId);
                updateUploadState({ upload: { loading: false, success: true, error: null } });
                return;
              } else {
                error('Erreur pendant le téléversement');
                updateUploadState({ upload: { loading: false, success: false, error: true } });
                return;
              }
            } catch (err) {
              error('Erreur pendant le televersement');
              updateUploadState({ upload: { loading: false, success: false, error: true } });
            }
          }) as unknown) as ProcessServerConfigFunction,
          revert: null,
          restore: null,
          load: null,
          fetch: null,
        }}
      />
    </View>
  ) : (
    <Card style={{ height: 50, flex: 1, marginBottom: 30 }}>
      <View style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
        <View>
          <Icon name="image" size={24} color={colors.disabled} />
        </View>
        <View style={{ marginHorizontal: 10, flexGrow: 1 }}>
          <Text>
            Vous n&apos;avez pas l&apos;autorisation d&apos;ajouter des images pour ce groupe
          </Text>
        </View>
      </View>
    </Card>
  );
};

const mapStateToProps = (state: State) => {
  const { upload, account } = state;
  return { state: upload.state, account };
};

export default connect(mapStateToProps)(FileUpload);
