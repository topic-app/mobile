/* eslint-disable no-throw-literal */
import axiosCreator, { AxiosResponse } from 'axios';
import { Platform } from 'react-native';

import { Config } from '@constants';
import Store from '@redux/store';

import { crashlytics } from './compat/firebase';
import logger from './logger';

const axios = axiosCreator.create({
  baseURL: Config.api.url.base,
  timeout: Config.api.timeout,
});

type ApiDataType = {
  success: boolean;
  info?: {
    [key: string]: any;
  };
};

async function request(
  endpoint: string,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  params = {},
  auth = false,
  server: 'base' | 'auth' | 'data' = 'base',
) {
  let url;
  const { useDevServer } = Store.getState().preferences;

  if (useDevServer) {
    url = Config.api.devUrl[server];
  } else {
    url = Config.api.url[server];
  }

  logger.http({
    method,
    endpoint,
    params,
    sent: true,
  });
  const headers = auth
    ? { Authorization: `Bearer ${Store.getState().account.accountInfo?.accountToken}` }
    : {};
  if (method === 'get') {
    let res: AxiosResponse<ApiDataType>;
    try {
      res = await axios.get(`${url}/${endpoint}`, { params, headers });
    } catch (error) {
      logger.warn('Request error');
      logger.http({
        status: error?.status,
        method,
        endpoint,
        params,
        data: error?.response,
      });
      if (!__DEV__ && Platform.OS !== 'web') {
        crashlytics!().recordError(
          new Error(
            `GET Request failed ${JSON.stringify({
              status: error?.status,
              endpoint: `${url}/${endpoint}`,
              data: error?.response?.data,
            })}`,
          ),
        );
      }
      throw {
        success: false,
        reason: 'axios',
        status: error?.status,
        error,
        res: null,
      };
    }
    if (res.data.success === true) {
      logger.http({
        status: res.status,
        method,
        endpoint,
        params,
        data: res.data.info,
      });
      return {
        success: true,
        data: res.data.info,
      };
    }
    logger.http({
      status: res?.status,
      method,
      endpoint,
      params,
      data: res?.data?.info,
    });
    if (!__DEV__ && Platform.OS !== 'web') {
      crashlytics!().recordError(
        new Error(
          `GET Request server failure ${JSON.stringify({
            status: res?.status,
            endpoint: `${url}/${endpoint}`,
            data: res?.data,
          })}`,
        ),
      );
    }
    throw { success: false, reason: 'success', status: res?.status, error: null, res };
  }
  if (method === 'post') {
    let res: AxiosResponse<ApiDataType>;
    try {
      res = await axios.post(`${url}/${endpoint}`, params, { headers });
    } catch (error) {
      logger.http({
        status: error.status,
        method,
        endpoint,
        params,
        data: error.response,
      });
      if (!__DEV__ && Platform.OS !== 'web') {
        crashlytics!().recordError(
          new Error(
            `POST Request failed ${JSON.stringify({
              status: error?.status,
              endpoint: `${url}/${endpoint}`,
              data: error?.response?.data,
            })}`,
          ),
        );
      }
      throw {
        success: false,
        reason: 'axios',
        status: error.status,
        error,
        res: null,
      };
    }
    if (res.data.success === true) {
      logger.http({
        status: res.status,
        method,
        endpoint,
        params,
        data: res.data.info,
      });
      return {
        success: true,
        data: res.data.info,
      };
    }
    logger.http({
      status: res.status,
      method,
      endpoint,
      params,
      data: res.data.info,
    });
    if (!__DEV__ && Platform.OS !== 'web') {
      crashlytics!().recordError(
        new Error(
          `POST Request server failure ${JSON.stringify({
            status: res?.status,
            method,
            endpoint,
            data: res?.data?.info,
          })}`,
        ),
      );
    }
    throw { success: false, reason: 'success', status: res?.status, error: null, res };
  }
  logger.warn(`Request failed to ${endpoint} because of missing method ${method}`);
  throw { success: false, reason: 'method', status: null, error: null };
}

export default request;
