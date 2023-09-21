export type AccessToken = {
    access_token: string;
    refresh_token: string;
    userName: string;
    email: string;
    id: number;
    fcmToken: string;
}
export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    TaskListing: undefined;
    CreateTaskList: undefined;
    TaskLists: undefined;
  };