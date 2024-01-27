import { UserSignInResponse } from "@/types/UserSignIn";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserSignInResponse | null = null;

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setCurrentUser: (_state, action) => {
      return action.payload;
    },
  },
});

export const { setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
