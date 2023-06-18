import React from 'react'
import { createContext, useEffect, useState, useMemo } from 'react';

export type UserAccount = {
    id?: number;
    username?: string;
    access_token?: string;
    refresh_token?: string;
}
interface GlobalContext {
    user: UserAccount | null;
    setUser: (newUser: UserAccount) => void;
}


const defaultContext: GlobalContext = {
    user: null,
    setUser () {},
}
export const GlobalContext = createContext<GlobalContext>(defaultContext);

export const GlobalContextProvider = ({children}: any) => {
    const [user, setUser] = useState<UserAccount | null>(null);
    
    const globals: GlobalContext = useMemo<GlobalContext>(
        () => ({
          user,
          setUser,
        }),
        [
          user,
          setUser,
        ],
      );

  return <GlobalContext.Provider value={globals}>{children}</GlobalContext.Provider>;
      
}

export default GlobalContextProvider;

