import React, {useContext, useEffect} from 'react';
import {GlobalContext, UserAccount} from '../GlobalContext';
import axios from 'axios';
import {APP_URL} from '@env';

const LoginScreen = () => {
  const {user, setUser} = useContext(GlobalContext);

  const getTasks = async (token: string) => {
    await axios
      .get(APP_URL + 'tasks/Index', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getUserToken = async () => {
    await axios
      .post(
        APP_URL + 'useraccount/CreateToken',
        {username: 'joydip', password: 'joydip123'},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .then(response => {
        console.log(response.data);
        const user: UserAccount = {
          id: 1,
          username: 'test',
          access_token: response.data,
        };
        getTasks(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUserToken();
  }, []);

  return <></>;
};

export default LoginScreen;
