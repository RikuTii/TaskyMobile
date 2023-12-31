import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import GlobalContextProvider from './components/GlobalContext';
import LoginScreen from './components/screens/LoginScreen';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import {
  DrawerToggleButton,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { MMKV } from 'react-native-mmkv';
import TaskListing from './components/screens/TaskListing';
import CreateTaskList from './components/screens/CreateTaskList';
import { RootStackParamList } from './types/global';
import TaskLists from './components/screens/TaskLists';
import HeaderTitle from './components/layout/HeadTitle';

export const storage = new MMKV();

const Drawer = createDrawerNavigator<RootStackParamList>();

const navigatorTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#25262B',
    background: '#25262B',
    card: 'rgb(90, 90, 90)',
    text: 'rgb(200,200,200)',
  },
};

const App = (): JSX.Element => {
  return (
    <GlobalContextProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer theme={navigatorTheme}>
          <Drawer.Navigator
            initialRouteName="Login"
            screenOptions={{
              drawerPosition: 'right',
              headerLeft: () => false,
              headerRight: () => <DrawerToggleButton tintColor='white'/>,
              headerStyle: {backgroundColor: navigatorTheme.colors.background},
              headerTitle: () => <HeaderTitle/>
            }}>
            <Drawer.Screen
              name="Login"
              options={{ title: 'Login' }}
              component={LoginScreen}
            />
            <Drawer.Screen
              name="TaskListing"
              options={{ title: 'TaskListing' }}
              component={TaskListing}
            />
            <Drawer.Screen
              name="CreateTaskList"
              options={{ title: 'CreateTaskList' }}
              component={CreateTaskList}
            />
            <Drawer.Screen
              name="TaskLists"
              options={{ title: 'Manage tasklists' }}
              component={TaskLists}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </GlobalContextProvider>
  );
};

export default App;
