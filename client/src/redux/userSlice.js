import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null, // Retrieve user from local storage
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload;  // Store the user data
            localStorage.setItem('user', JSON.stringify(action.payload)); // Save user to local storage
        },
        logout: (state) => {
            state.user = null;  // Clear user data on logout
            localStorage.removeItem('user'); // Remove user from local storage
        },
    },
});

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
