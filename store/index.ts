// // Redux store configuration
// import { configureStore } from '@reduxjs/toolkit';
// import heroReducer from './slices/heroSlice';
// import servicesReducer from './slices/servicesSlice';
// import siteSettingsReducer from './slices/siteSettingsSlice';
// import adminUIReducer from './slices/adminUISlice';

// export const store = configureStore({
//   reducer: {
//     hero: heroReducer,
//     services: servicesReducer,
//     siteSettings: siteSettingsReducer,
//     adminUI: adminUIReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import { configureStore } from '@reduxjs/toolkit'
import heroReducer from './slices/heroSlice'
import servicesReducer from './slices/servicesSlice'
import siteSettingsReducer from './slices/siteSettingsSlice'

export const store = configureStore({
  reducer: {
    hero: heroReducer,
    services: servicesReducer,
    siteSettings: siteSettingsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch