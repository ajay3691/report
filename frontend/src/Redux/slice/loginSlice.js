import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    isAuth: false,
    userData: null,
  },
  reducers: {
    logIn: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.isAuth = true;
      state.userData = action.payload;
    },
    logOut: (state) => {
      state.isAuth = false;
      state.userData = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { logIn, logOut } = loginSlice.actions;

export default loginSlice.reducer;
