import { createSlice } from '@reduxjs/toolkit';

interface NavState {
    ActiveNav: string;
}

const initialState: NavState = {
    ActiveNav: 'activeDeals',
};

export const AdminNav = createSlice({
    name: 'AdminNav',
    initialState,
    reducers: {
        setNavActive: (state, action) => {
            state.ActiveNav = action.payload;
        },
    },
});

export const { setNavActive } = AdminNav.actions;

export const adminNavReducer = AdminNav.reducer;
