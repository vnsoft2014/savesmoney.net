import { createSlice } from '@reduxjs/toolkit';

interface UserState {
    userData: {} | null;
    userToken: string | null;
}

const initialState: UserState = {
    userData: null,
    userToken: null,
};

export const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setUserToken: (state, actions) => {
            state.userToken = actions.payload;
        },
    },
});

export const { setUserData, setUserToken } = userSlice.actions;

export const userReducer = userSlice.reducer;
