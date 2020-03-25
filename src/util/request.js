import axios from 'axios';

function request(endpoint, method, params, auth) {
  return new Promise((resolve, reject) => {
    if (method === 'get') {
      axios.get(endpoint)
        .then((res) => {

        })
        .catch((err) => {
          reject();
        });
    } else if (method === 'post') {
      axios.post(endpoint)
        .then((res) => {

        })
        .catch((err) => {
          reject();
        });
    } else {
      reject();
    }
  });
}

export default request;
