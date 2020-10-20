import React from 'react'
import store from './store'

export const stores = {
	store: store,
}

export const StoresContext = React.createContext(stores)

export const useStore = () => React.useContext(StoresContext)
