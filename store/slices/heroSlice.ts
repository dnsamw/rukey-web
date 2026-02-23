// // Redux slice for hero slides
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface HeroSlide {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
// }

// interface HeroState {
//   slides: HeroSlide[];
//   loading: boolean;
// }

// const initialState: HeroState = {
//   slides: [],
//   loading: false,
// };

// const heroSlice = createSlice({
//   name: 'hero',
//   initialState,
//   reducers: {
//     setSlides: (state, action: PayloadAction<HeroSlide[]>) => {
//       state.slides = action.payload;
//     },
//     addSlide: (state, action: PayloadAction<HeroSlide>) => {
//       state.slides.push(action.payload);
//     },
//     removeSlide: (state, action: PayloadAction<string>) => {
//       state.slides = state.slides.filter((slide) => slide.id !== action.payload);
//     },
//   },
// });

// export const { setSlides, addSlide, removeSlide } = heroSlice.actions;
// export default heroSlice.reducer;


import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { HeroSlide } from '@/types/hero'

type HeroState = {
  slides: HeroSlide[]
  loading: boolean
}

const initialState: HeroState = {
  slides: [],
  loading: false,
}

const heroSlice = createSlice({
  name: 'hero',
  initialState,
  reducers: {
    setSlides(state, action: PayloadAction<HeroSlide[]>) {
      state.slides = action.payload
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
  },
})

export const { setSlides, setLoading } = heroSlice.actions
export default heroSlice.reducer