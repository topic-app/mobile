import axios from './axiosInstance';

async function request(endpoint, method, params = {}, auth = false) {
  if (method === 'get') {
    const res = await axios.get(endpoint, { params })
    if (res.status === 200) {
      if (res.data.success === true) {
        return {
          success: true,
          data: (res.data.info)
        };
      }
      return {
        success: false,
        reason: 'success',
      }
    }
    return {
      success: false,
      reason: 'status',
      status: res.status,
    }

  } if (method === 'post') {
    const res = await axios.post(endpoint, params)
    if (res.status === 200) {
      if (res.data.success === true) {
        return {
          success: true,
          data: (res.data.info)
        };
      }
      return {
        success: false,
        reason: 'success',
      }
    }
    return {
      success: false,
      reason: 'status',
      status: res.status,
    }

  }
  return {
    success: false,
    reason: 'method'
  };
}

export default request;
