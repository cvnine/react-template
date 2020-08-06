import React from 'react';
import AuthStore from "./AuthStore";

export const stores = {
    authStore : AuthStore,
}

export const StoresContext = React.createContext(stores)

export const useStore = () => React.useContext(StoresContext)

