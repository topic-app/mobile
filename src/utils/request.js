/* eslint-disable no-throw-literal */
import { config } from '@root/app.json';
import axios from './axiosInstance';

async function request(endpoint, method, params = {}, auth = false) {
  if (config.dev.logRequests) {
    console.log(`${method} request to ${endpoint} with ${JSON.stringify(params)}`);
  }
  if (method === 'get') {
    let res = { data: { success: false } };
    try {
      res = await axios.get(endpoint, { params });
    } catch (err) {
      console.log(
        `Request to ${endpoint} with ${JSON.stringify(params)} failed with status ${
          res?.status
        }, res ${JSON.stringify(res)} and err success/${err} ${JSON.stringify(err?.response)}`,
      );
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
    console.log(
      `Request to ${endpoint} with ${JSON.stringify(params)} failed with status ${
        res?.status
      }, res ${JSON.stringify(res)} and err success/null`,
    );
    throw { success: false, reason: 'success', status: res?.status, error: null, res };
  }
  if (method === 'post') {
    let res = { data: { success: false } };
    try {
      res = await axios.post(endpoint, params);
    } catch (err) {
      console.log(
        `Request to ${endpoint} with ${JSON.stringify(params)} failed with status ${
          res?.status
        }, res ${JSON.stringify(res)} and err success/${err} ${JSON.stringify(err?.response)}`,
      );
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
    console.log(
      `Request to ${endpoint} with ${JSON.stringify(params)} failed with status ${
        res?.status
      }, res ${JSON.stringify(res)} and err success/null`,
    );
    throw { success: false, reason: 'success', status: res?.status, error: null, res };
  }
  console.log(
    `Request failed to ${endpoint} with ${JSON.stringify(params)} because of missing method`,
  );
  throw { success: false, reason: 'method', status: null, error: null };
}

export default request;
