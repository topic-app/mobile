import axios from './axiosInstance';

async function request(endpoint, method, params = {}, auth = false) {
  if (method === 'get') {
    let res = { data: { success: false } };
    try {
      res = await axios.get(endpoint, { params });
    } catch (err) {
      throw new Error({
        success: false,
        reason: 'status',
        status: err.status,
        error: err,
        res: null,
      });
    }
    if (res.data.success === true) {
      return {
        success: true,
        data: res.data.info,
      };
    }
    throw new Error({ success: false, reason: 'success', status: res.status, error: null, res });
  }
  if (method === 'post') {
    let res = { data: { success: false } };
    try {
      res = await axios.post(endpoint, params);
    } catch (err) {
      throw new Error({
        success: false,
        reason: 'status',
        status: err.status,
        error: err,
        res: null,
      });
    }
    if (res.data.success === true) {
      return {
        success: true,
        data: res.data.info,
      };
    }
    throw new Error({ success: false, reason: 'success', status: res.status, error: null, res });
  }
  throw new Error({ success: false, reason: 'method', status: null, error: null });
}

export default request;
