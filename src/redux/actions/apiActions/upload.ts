import { Platform } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import { Config } from '@constants/index';
import Store from '@redux/store';
import { UPDATE_UPLOAD_STATE } from '@ts/redux';
import { AppThunk } from '@ts/types';
import { request, logger } from '@utils/index';

function uploadCreator(
  groupId: string,
  resizeMode: 'content-primary' | 'avatar' | 'content-inline' = 'content-primary',
  avatar: boolean = false,
  camera: boolean | 'back' | 'front' = false,
): AppThunk<Promise<string>> {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_UPLOAD_STATE,
      data: {
        permission: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    let permission;
    try {
      permission = await request(
        'permission/upload',
        'post',
        {
          groupId,
        },
        true,
      );
    } catch (error) {
      dispatch({
        type: UPDATE_UPLOAD_STATE,
        data: {
          permission: {
            loading: false,
            success: false,
            error,
          },
        },
      });
      throw error;
    }
    dispatch({
      type: UPDATE_UPLOAD_STATE,
      data: {
        permission: {
          loading: false,
          success: true,
          error: null,
        },
      },
    });
    let file;
    if (camera) {
      file = await ImagePicker.openCamera({
        mediaType: 'photo',
        useFrontCamera: camera === 'front',
        cropperCircleOverlay: avatar,
        cropping: true,
        compressImageMaxWidth: 2048,
        compressImageMaxHeight: 2048,
        cropperToolbarTitle: "Rogner l'image",
        freeStyleCropEnabled: true,
        cropperActiveWidgetColor: '#592989',
        cropperChooseText: 'Choisir',
        cropperCancelText: 'Annuler',
      });
    } else if (avatar) {
      file = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        width: 2048,
        height: 2048,
        enableRotationGesture: true,
        hideBottomControls: true,
        compressImageMaxWidth: 2048,
        compressImageMaxHeight: 2048,
        showCropGuidelines: false,
        showCropFrame: false,
        cropperCircleOverlay: true,
        cropperToolbarTitle: "Rogner l'image",
        cropperActiveWidgetColor: '#592989',
        cropperChooseText: 'Choisir',
        cropperCancelText: 'Annuler',
      });
    } else {
      file = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        compressImageMaxWidth: 2048,
        compressImageMaxHeight: 2048,
        cropperToolbarTitle: "Rogner l'image",
        freeStyleCropEnabled: true,
        cropperActiveWidgetColor: '#592989',
        cropperChooseText: 'Choisir',
        cropperCancelText: 'Annuler',
      });
    }
    if (!file.path) {
      logger.warn('File chosen but path not given');
      throw new Error('File chosen but no path given');
    }
    const uploadFile = {
      uri: Platform.OS === 'android' ? file.path : file.path.replace('file://', ''),
      name: 'image.jpg',
      type: file.mime,
    };
    dispatch({
      type: UPDATE_UPLOAD_STATE,
      data: {
        upload: {
          loading: true,
          success: null,
          error: null,
        },
      },
    });
    try {
      logger.debug('Trying image upload');
      const data = new FormData();
      data.append('resizeMode', resizeMode);
      data.append('file', uploadFile as any);
      const res = await fetch(Config.cdn.uploadUrl, {
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${permission.data?.token}`,
        },
      });
      const responseJson = await res.json();
      if (!responseJson.error) {
        dispatch({
          type: UPDATE_UPLOAD_STATE,
          data: {
            upload: {
              loading: false,
              success: true,
              error: null,
            },
          },
        });
        logger.debug(`File ${responseJson.fileId} uploaded`);
        return responseJson.fileId;
      } else {
        logger.warn(`Error during upload`);
        logger.warn(responseJson);
        dispatch({
          type: UPDATE_UPLOAD_STATE,
          data: {
            upload: {
              loading: false,
              success: false,
              error: responseJson,
            },
          },
        });
      }
    } catch (err) {
      logger.warn(`Error during upload`);
      logger.warn(err);
      dispatch({
        type: UPDATE_UPLOAD_STATE,
        data: {
          upload: {
            loading: false,
            success: false,
            error: err,
          },
        },
      });
      throw err;
    }
  };
}

async function upload(
  groupId: string,
  resizeMode?: 'content-primary' | 'content-inline' | 'avatar',
  avatar?: boolean,
  camera?: boolean | 'back' | 'front',
) {
  return Store.dispatch(uploadCreator(groupId, resizeMode, avatar, camera));
}

export default upload;
export { upload };
