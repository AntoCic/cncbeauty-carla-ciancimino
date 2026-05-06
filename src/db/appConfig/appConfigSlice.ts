import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAppConfig } from './appConfigRepo';
import type { AppConfigData } from '../../models/AppConfig';
import { APP_CONFIG_DEFAULTS, APP_CONFIG_ID } from '../../models/AppConfig';

export const fetchAppConfig = createAsyncThunk('appConfig/fetch', () => getAppConfig());

interface AppConfigState {
  data: AppConfigData;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AppConfigState = {
  data: { id: APP_CONFIG_ID, ...APP_CONFIG_DEFAULTS },
  status: 'idle',
};

const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAppConfig.pending, state => { state.status = 'loading'; })
      .addCase(fetchAppConfig.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAppConfig.rejected, state => { state.status = 'failed'; });
  },
});

export default appConfigSlice.reducer;
