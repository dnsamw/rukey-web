// // Redux slice for services
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface Service {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   image: string;
// }

// interface ServicesState {
//   services: Service[];
//   loading: boolean;
// }

// const initialState: ServicesState = {
//   services: [],
//   loading: false,
// };

// const servicesSlice = createSlice({
//   name: "services",
//   initialState,
//   reducers: {
//     setServices: (state, action: PayloadAction<Service[]>) => {
//       state.services = action.payload;
//     },
//     addService: (state, action: PayloadAction<Service>) => {
//       state.services.push(action.payload);
//     },
//     updateService: (state, action: PayloadAction<Service>) => {
//       const index = state.services.findIndex((s) => s.id === action.payload.id);
//       if (index !== -1) {
//         state.services[index] = action.payload;
//       }
//     },
//     removeService: (state, action: PayloadAction<string>) => {
//       state.services = state.services.filter((s) => s.id !== action.payload);
//     },
//   },
// });

// export const { setServices, addService, updateService, removeService } =
//   servicesSlice.actions;
// export default servicesSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Service } from '@/types/service'

type ServicesState = {
  services: Service[]
  loading: boolean
}

const initialState: ServicesState = {
  services: [],
  loading: false,
}

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices(state, action: PayloadAction<Service[]>) {
      state.services = action.payload
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
  },
})

export const { setServices, setLoading } = servicesSlice.actions
export default servicesSlice.reducer