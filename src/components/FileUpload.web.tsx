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
import { Card, Text, Button, useTheme, ProgressBar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { Config } from '@constants';
import { upload } from '@redux/actions/apiActions/upload';
import getStyles from '@styles/global';
import { State, UploadRequestState, Account } from '@ts/types';
import { checkPermission, getImageUrl, trackEvent, Permissions, logger, request } from '@utils';

import ErrorMessage from './ErrorMessage';

type Props = {
  file: string | null;
  setFile: (id: string | null) => void;
  group: string;
  state: UploadRequestState;
  account: Account;
  resizeMode: 'content-primary' | 'avatar' | 'content-inline';
};

const FileUpload: React.FC<Props> = ({
  file,
  setFile,
  group,
  state,
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
    <View>
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
              return;
            }
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
                return;
              } else {
                error('Erreur pendant le téléversement');
                return;
              }
            } catch (err) {
              error('Erreur pendant le televersement');
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
