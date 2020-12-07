/* eslint-disable no-throw-literal */
import { AxiosResponse } from 'axios';

import Store from '@redux/store';

import axios from './axiosInstance';
import logger from './logger';
import { Config } from '../constants';

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
) {
  logger.http({
    method,
    endpoint,
    params,
    sent: true,
  });
  if (Store.getState().preferences.useDevServer) {
    axios.defaults.baseURL = Config.api.devUrl;
  } else {
    axios.defaults.baseURL = Config.api.baseUrl;
  }
  const headers = auth
    ? { Authorization: `Bearer ${Store.getState().account.accountInfo?.accountToken}` }
    : {};
  if (method === 'get') {
    let res: AxiosResponse<ApiDataType>;
    try {
      res = await axios.get(endpoint, { params, headers });
    } catch (error) {
      logger.http({
        status: error?.status,
        method,
        endpoint,
        params,
        data: error?.data,
      });
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
    throw { success: false, reason: 'success', status: res?.status, error: null, res };
  }
  if (method === 'post') {
    let res: AxiosResponse<ApiDataType>;
    try {
      res = await axios.post(endpoint, params, { headers });
    } catch (error) {
      logger.http({
        status: error.status,
        method,
        endpoint,
        params,
        data: error.data,
      });
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
    throw { success: false, reason: 'success', status: res?.status, error: null, res };
  }
  logger.warn(`Request failed to ${endpoint} because of missing method ${method}`);
  throw { success: false, reason: 'method', status: null, error: null };
}

export default request;
