/* eslint-disable no-throw-literal */
import axios from './axiosInstance';

async function request(endpoint, method, params = {}, auth = false) {
  if (method === 'get') {
    let res = { data: { success: false } };
    try {
      res = await axios.get(endpoint, { params });
    } catch (err) {
      throw {
        success: false,
        reason: 'axios',
        status: err?.status,
        error: err,
        res: null,
      };
    }
    if (res?.data?.success === true) {
      return {
        success: true,
        data: res?.data?.info,
      };
    }
    throw { success: false, reason: 'success', status: res?.status, error: null, res };
  }
  if (method === 'post') {
    let res = { data: { success: false } };
    try {
      res = await axios.post(endpoint, params);
    } catch (err) {
      throw {
        success: false,
        reason: 'axios',
        status: err?.status,
        error: err,
        res: null,
      };
    }
    if (res?.data?.success === true) {
      return {
        success: true,
        data: res?.data?.info,
      };
    }
    throw { success: false, reason: 'success', status: res?.status, error: null, res };
  }
  throw { success: false, reason: 'method', status: null, error: null };
}

export default request;
