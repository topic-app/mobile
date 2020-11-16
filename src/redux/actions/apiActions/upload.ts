/* eslint-disable no-throw-literal */
import Store from '@redux/store';
import ImagePicker from 'react-native-image-crop-picker';
import { State } from '@ts/types';
import { UPDATE_UPLOAD_STATE } from '@ts/redux';

import { request } from '@utils/index';
import { Platform } from 'react-native';

function uploadCreator(groupId: string, resizeMode: 'content-primary' = 'content-primary') {
  return (dispatch: (action: any) => void, getState: () => State) => {
    return new Promise((resolve, reject) => {
      console.log('Upload creator');
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
          let file = await ImagePicker.openPicker({
            mediaType: 'photo',
            cropping: true,
            cropperToolbarTitle: "Rogner l'image",
            freeStyleCropEnabled: true,
            cropperActiveWidgetColor: '#592989',
            cropperChooseText: 'Choisir',
            cropperCancelText: 'Annuler',
          });
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
            console.log('TRYING UPLOAD');
            console.log(file);
            console.log(permission.data?.token);
            const data = new FormData();
            data.append('resizeMode', resizeMode);
            data.append('file', uploadFile);
            let res = await fetch('https://cdn.topicapp.fr/file/upload', {
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

async function upload(groupId: string) {
  return await Store.dispatch(uploadCreator(groupId));
}

export default upload;
export { upload };
