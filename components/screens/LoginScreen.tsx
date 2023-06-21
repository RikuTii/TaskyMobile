import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext, UserAccount } from '../GlobalContext';
import axios from 'axios';
import { APP_URL } from '@env';
import { storage } from '../../App';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AccessToken, RootStackParamList } from '../../types/global';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const { user, setUser } = useContext(GlobalContext);
  //dev placeholders
  const [userName, setUsername] = useState('joydip');
  const [password, setPassword] = useState('joydip123');

  useEffect(() => {
    if (storage.contains('access_token') && storage.contains('refresh_token')) {
      if (user === null) {
        if (isTokenExpired()) {
          refreshToken();
        } else {
          const user: UserAccount = {
            id: 1,
            username: 'mobileUser',
            access_token: storage.getString('access_token'),
            refresh_token: storage.getString('refresh_token'),
          };
          setUser(user);
          navigation.navigate('TaskListing');
        }
      }
    }
  }, []);

  const getUserToken = async () => {
    console.log('request');
    await axios
      .post(
        APP_URL + 'useraccount/CreateToken',
        { username: userName, password: password },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .then(response => {
        const token: AccessToken = response.data;
        console.log('got token');
        storage.set('access_token', token.access_token);
        storage.set('refresh_token', token.refresh_token);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const refreshToken = async () => {
    console.log('refresh',APP_URL);
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
        console.log('got token');
        storage.set('access_token', token.access_token);
        storage.set('refresh_token', token.refresh_token);
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  const isTokenExpired = () => {
    const tokenString = storage.getString('access_token');
    if (tokenString) {
      const decodedToken = jwtDecode<JwtPayload>(tokenString);
      if (decodedToken && decodedToken.exp) {
        if (decodedToken.exp * 1000 < new Date().getTime()) {
          return true;
        }
      }
    }
    return false;
  };

  const attemptLogin = () => {
    //  getUserToken(); return;
    // refreshToken(); return;
    /* if (storage.contains('access_token')) {
      if (isTokenExpired()) {
        console.log('token expired');
        refreshToken();
      } else {
        console.log('valid token');
      }
    } else {
      getUserToken();
    }*/
    getUserToken();
  };

  return (
    <View style={styles.loginBase}>
      <Text style={styles.inputTitle}>Username</Text>
      <TextInput
        onChangeText={(text: string) => {
          setUsername(text);
        }}
        value={userName}
        style={styles.input}
      />
      <Text style={styles.inputTitle}>Password</Text>
      <TextInput
        onChangeText={(text: string) => {
          setPassword(text);
        }}
        secureTextEntry={true}
        value={password}
        style={styles.input}
      />
      <Pressable onPress={attemptLogin}>
        <View style={styles.loginButton}>
          <Text style={styles.buttonTitle}>Login</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  loginBase: {
    padding: 10,
  },
  loginButton: {
    marginLeft: 'auto',
    width: 70,
    height: 40,
    backgroundColor: 'darkblue',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderRadius: 4,
  },
  buttonTitle: {
    color: 'white',
    fontSize: 18,
  },
  inputTitle: {
    color: 'white',
  },
  input: {
    borderBottomWidth: 2,
    borderColor: 'rgb(124,124,124)',
    color: 'white',
    marginVertical: 4,
    padding: 0,
  },
});

export default LoginScreen;
