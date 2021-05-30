import React from 'react';
import {
  Platform,
  ScrollView,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import ModalComponent from 'react-native-modal';
import { Card, Text, Button, useTheme, ProgressBar, Title } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { Avatar, PlatformTouchable } from '@components';
import { upload } from '@redux/actions/apiActions/upload';
import getStyles from '@styles/global';
import { State, UploadRequestState, Account } from '@ts/types';
import { checkPermission, getImageUrl, trackEvent, Permissions } from '@utils';

import ErrorMessage from './ErrorMessage';

type Props = {
  file: string | null;
  setFile: (id: string | null) => void;
  group: string;
  state: UploadRequestState;
  account: Account;
  type?: 'content' | 'avatar';
  title?: string;
  allowDelete?: boolean;
  resizeMode?: 'content-primary' | 'avatar' | 'content-inline';
};

const FileUpload: React.FC<Props> = ({
  file,
  setFile,
  group,
  state,
  title,
  account,
  allowDelete = true,
  type = 'content',
  resizeMode = 'content-primary',
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  return checkPermission(account, {
    permission: Permissions.CONTENT_UPLOAD,
    scope: { groups: [group || ''] },
  }) ? (
    <View>
      {title ? (
        <View style={[styles.container, styles.centerIllustrationContainer]}>
          <Title style={{ textAlign: 'center', fontSize: 18 }}>{title}</Title>
        </View>
      ) : null}
      {type === 'avatar' ? (
        <View style={[styles.container, { marginBottom: 30 }]}>
          {file && !state.upload?.loading && (
            <View style={styles.centerIllustrationContainer}>
              <Avatar
                imageUrl={
                  getImageUrl({
                    image: { image: file, thumbnails: {} },
                    size: 'full',
                  }) || ''
                }
                size={100}
                onPress={() => {
                  trackEvent('image:avatar-replace');
                  upload(group, resizeMode, true).then(setFile);
                }}
                editing
              />
            </View>
          )}
          {state.upload?.error && (
            <ErrorMessage
              error={state.upload?.error}
              strings={{
                what: "l'upload de l'image",
                contentSingular: "L'image",
              }}
              type="axios"
              retry={() => upload(group, resizeMode, true).then(setFile)}
            />
          )}
          {!!state.upload?.loading && (
            <View
              style={{
                height: 100,
                width: 100,
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                backgroundColor: colors.surface,
              }}
            >
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
          {!file && !state.upload?.loading && (
            <TouchableOpacity
              onPress={() => {
                trackEvent('image:avatar-upload');
                upload(group, resizeMode, true).then(setFile);
              }}
              style={{
                height: 100,
                width: 100,
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                backgroundColor: colors.surface,
              }}
            >
              <Icon color={colors.text} name="image-plus" size={24} />
              <Text>Avatar</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View>
          {file && !state.upload?.loading && (
            <View style={styles.container}>
              <Card style={{ minHeight: 100 }}>
                <Image
                  source={{
                    uri:
                      getImageUrl({
                        image: { image: file, thumbnails: {} },
                        size: 'full',
                      }) || '',
                  }}
                  style={{ height: 250 }}
                  resizeMode="contain"
                />
              </Card>
            </View>
          )}
          <View style={[styles.container, { marginBottom: 30 }]}>
            {state.upload?.error && (
              <ErrorMessage
                error={state.upload?.error}
                strings={{
                  what: "l'upload de l'image",
                  contentSingular: "L'image",
                }}
                type="axios"
                retry={() => upload(group, resizeMode).then(setFile)}
              />
            )}
            {state.upload?.loading ? (
              <Card style={{ height: 50, flex: 1 }}>
                <View style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
                  <View>
                    <Icon name="image" size={24} color={colors.disabled} />
                  </View>
                  <View style={{ marginHorizontal: 10, flexGrow: 1 }}>
                    <ProgressBar indeterminate />
                  </View>
                </View>
              </Card>
            ) : (
              <View style={{ flexDirection: 'row' }}>
                <Button
                  mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                  uppercase={false}
                  onPress={() => {
                    trackEvent(file ? 'image:image-replace' : 'image:image-upload');
                    upload(group, resizeMode).then(setFile);
                  }}
                  style={{ flex: 1, marginRight: 5 }}
                >
                  {file ? 'Remplacer' : 'Séléctionner une image'}
                </Button>
                {file && allowDelete ? (
                  <Button
                    mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                    uppercase={false}
                    onPress={() => {
                      trackEvent('image:image-remove');
                      setFile(null);
                    }}
                    style={{ flex: 1, marginLeft: 5 }}
                  >
                    Supprimer
                  </Button>
                ) : null}
              </View>
            )}
          </View>
        </View>
      )}
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
