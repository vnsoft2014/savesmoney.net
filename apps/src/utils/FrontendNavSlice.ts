import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuLink } from '@/shared/types';
import { SettingsForm } from '@/types/settings';
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
