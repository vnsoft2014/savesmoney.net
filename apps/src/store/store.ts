'use client';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from './storage';

import { adminNavReducer } from '@/lib/adminNavSlice';
import { FrontendNavReducer } from '@/lib/frontendNavSlice';

const rootReducer = combineReducers({
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
