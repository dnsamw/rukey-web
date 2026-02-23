// // Redux slice for site settings
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface SiteSettings {
//   logo: string;
//   primaryColor: string;
//   secondaryColor: string;
//   phone: string;
//   email: string;
//   address: string;
// }

// interface SettingsState {
//   settings: SiteSettings | null;
//   loading: boolean;
// }

// const initialState: SettingsState = {
//   settings: null,
//   loading: false,
// };

// const siteSettingsSlice = createSlice({
//   name: 'siteSettings',
//   initialState,
//   reducers: {
//     setSettings: (state, action: PayloadAction<SiteSettings>) => {
//       state.settings = action.payload;
//     },
//     updateSettings: (state, action: PayloadAction<Partial<SiteSettings>>) => {
//       if (state.settings) {
//         state.settings = { ...state.settings, ...action.payload };
//       }
//     },
//   },
// });

// export const { setSettings, updateSettings } = siteSettingsSlice.actions;
// export default siteSettingsSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { SiteSettings } from '@/types/settings'

type SiteSettingsState = {
  settings: SiteSettings | null
  loading: boolean
}

const initialState: SiteSettingsState = {
  settings: null,
  loading: false,
}

const siteSettingsSlice = createSlice({
  name: 'siteSettings',
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<SiteSettings>) {
      state.settings = action.payload
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
  },
})

export const { setSettings, setLoading } = siteSettingsSlice.actions
export default siteSettingsSlice.reducer