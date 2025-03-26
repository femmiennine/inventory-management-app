import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '@/src/types/user';

const initialState: UserState = {
  name: '',
  email: '',
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // login: (state, action: PayloadAction<{ name: string; email: string }>) => {
    //   state.name = action.payload.name;
    //   state.email = action.payload.email;
    //   state.isLoggedIn = true;
    // },
    // logout: (state) => {
    //   state.name = '';
    //   state.email = '';
    //   state.isLoggedIn = false;
    // },
  },
});

// export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
