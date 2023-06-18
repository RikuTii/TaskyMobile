import axios from 'axios';
import {APP_URL} from '@env';
import {storage} from '../App';

export const axiosInstance = axios.create({
  baseURL: APP_URL,
  timeout: 2000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + storage.getString('access_token'),
  },
});
