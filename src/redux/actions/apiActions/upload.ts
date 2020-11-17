import { Platform } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import { Config } from '@constants/index';
import Store from '@redux/store';
import { UPDATE_UPLOAD_STATE } from '@ts/redux';
import { AppThunk } from '@ts/types';
import { request, logger } from '@utils/index';

function uploadCreator(
  groupId: string,
  resizeMode: 'content-primary' = 'content-primary',
  avatar: boolean = false,
  camera: false | 'back' | 'front' = false,
): AppThunk {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
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
      request(
        'auth/permission/upload',
        'post',
        {
          groupId,
        },
        true,
      )
        .then(async (permission) => {
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
            return reject();
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
            data.append('file', uploadFile);
            let res = await fetch(Config.cdn.uploadUrl, {
              method: 'POST',
              body: data,
              headers: {
                Authorization: `Bearer ${permission.data?.token}`,
              },
            });
            let responseJson = await res.json();
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
              return resolve(responseJson.fileId);
            } else {
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
            return reject();
          }
        })
        .catch((error) => {
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
          reject();
        });
    });
  };
}

function upload(groupId: string) {
  return Store.dispatch(uploadCreator(groupId));
}

export default upload;
export { upload };
