// Redux slice for admin UI state
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminUIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  toastMessage: string | null;
}

const initialState: AdminUIState = {
  sidebarOpen: true,
  activeModal: null,
  toastMessage: null,
};

const adminUISlice = createSlice({
  name: 'adminUI',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    setToastMessage: (state, action: PayloadAction<string | null>) => {
      state.toastMessage = action.payload;
    },
  },
});

export const { toggleSidebar, openModal, closeModal, setToastMessage } = adminUISlice.actions;
export default adminUISlice.reducer;
