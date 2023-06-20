import axios from 'axios';
import {APP_URL} from '@env';
import {storage} from '../App';
import { AccessToken } from '../types/global';

export const axiosInstance = axios.create({
  baseURL: APP_URL,
  timeout: 2000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + storage.getString('access_token'),
  },
});


const refreshToken = async (error: any) => {
 // console.log("old", storage.getString('access_token'));
 console.log('get token');
  await axios
    .post(
      APP_URL + 'useraccount/RefreshToken',
      {
        access_token: storage.getString('access_token'),
        refresh_token: storage.getString('refresh_token'),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )
    .then(response => {
      const token: AccessToken = response.data;
      storage.set('access_token', token.access_token);
      storage.set('refresh_token', token.refresh_token);
      console.log('new token', token.access_token);
      setTimeout(() => {
        const cfg = {...error.config};
        cfg.headers.Authorization = "Bearer " + storage.getString('access_token');
        axiosInstance.request(cfg);
      }, 5000);
    })
    .catch(err => {
      console.log(err);
    });
};

axiosInstance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if(error.response?.status === 401) {
    console.log('refresh token');
    refreshToken(error);
    return Promise.reject(error); 
  }
  return Promise.reject(error);
});