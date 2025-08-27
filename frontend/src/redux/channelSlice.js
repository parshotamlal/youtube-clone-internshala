import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { channelAPI } from '../utils/api';

// Async thunks
export const fetchChannel = createAsyncThunk(
  'channels/fetchChannel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await channelAPI.getChannel(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch channel');
    }
  }
);

export const fetchChannelVideos = createAsyncThunk(
  'channels/fetchChannelVideos',
  async (id, { rejectWithValue }) => {
    try {
      const response = await channelAPI.getChannelVideos(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch channel videos');
    }
  }
);

export const subscribeToChannel = createAsyncThunk(
  'channels/subscribeToChannel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await channelAPI.subscribeToChannel(id);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to subscribe');
    }
  }
);

export const unsubscribeFromChannel = createAsyncThunk(
  'channels/unsubscribeFromChannel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await channelAPI.unsubscribeFromChannel(id);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unsubscribe');
    }
  }
);

const channelSlice = createSlice({
  name: 'channels',
  initialState: {
    currentChannel: null,
    channelVideos: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentChannel: (state) => {
      state.currentChannel = null;
      state.channelVideos = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch channel cases
      .addCase(fetchChannel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChannel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentChannel = action.payload;
      })
      .addCase(fetchChannel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch channel videos cases
      .addCase(fetchChannelVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChannelVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channelVideos = action.payload;
      })
      .addCase(fetchChannelVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Subscribe cases
      .addCase(subscribeToChannel.fulfilled, (state, action) => {
        if (state.currentChannel && state.currentChannel.id === action.payload.id) {
          state.currentChannel.isSubscribed = true;
          state.currentChannel.subscriberCount += 1;
        }
      })
      // Unsubscribe cases
      .addCase(unsubscribeFromChannel.fulfilled, (state, action) => {
        if (state.currentChannel && state.currentChannel.id === action.payload.id) {
          state.currentChannel.isSubscribed = false;
          state.currentChannel.subscriberCount -= 1;
        }
      });
  },
});

export const { clearCurrentChannel, clearError } = channelSlice.actions;
export default channelSlice.reducer;