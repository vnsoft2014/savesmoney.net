'use client';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from './storage';

import { adminNavReducer } from '@/utils/AdminNavSlice';
import { FrontendNavReducer } from '@/utils/FrontendNavSlice';
import { userReducer } from '@/utils/UserDataSlice';

const rootReducer = combineReducers({
    user: userReducer,
    adminNav: adminNavReducer,
    frontendNav: FrontendNavReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'adminNav'],
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
