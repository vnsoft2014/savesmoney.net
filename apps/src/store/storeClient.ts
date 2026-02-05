'use client';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { store } from './store';

import { AdminNavReducer } from '@/utils/AdminNavSlice';
import { UserReducer } from '@/utils/UserDataSlice';

const rootReducer = combineReducers({
    User: UserReducer,
    AdminNav: AdminNavReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['User'],
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);

export const persistor = persistStore(store);
