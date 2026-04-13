import { MenuLink } from '@/features/public/layout/components/header/types';
import { SettingsForm } from '@/types/settings';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { settingsDefault } from './settings';

interface NavState {
    links: Array<MenuLink>;
    settings: SettingsForm;
}

const initialState: NavState = {
    links: [],
    settings: settingsDefault,
};

export const FrontendNavSlice = createSlice({
    name: 'FrontendNav',
    initialState,
    reducers: {
        setLinks(state, action: PayloadAction<Array<MenuLink>>) {
            state.links = action.payload;
        },

        setSettings(state, action: PayloadAction<SettingsForm>) {
            state.settings = action.payload;
        },
    },
});

export const { setLinks, setSettings } = FrontendNavSlice.actions;

export const FrontendNavReducer = FrontendNavSlice.reducer;
