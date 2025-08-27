import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { videoAPI } from '../utils/api';

// Async thunks
export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getAllVideos(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch videos');
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  'videos/fetchVideoById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getVideoById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch video');
    }
  }
);

export const uploadVideo = createAsyncThunk(
  'videos/uploadVideo',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await videoAPI.uploadVideo(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload video');
    }
  }
);

export const likeVideo = createAsyncThunk(
  'videos/likeVideo',
  async (id, { rejectWithValue }) => {
    try {
      const response = await videoAPI.likeVideo(id);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like video');
    }
  }
);

export const dislikeVideo = createAsyncThunk(
  'videos/dislikeVideo',
  async (id, { rejectWithValue }) => {
    try {
      const response = await videoAPI.dislikeVideo(id);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to dislike video');
    }
  }
);

export const searchVideos = createAsyncThunk(
  'videos/searchVideos',
  async (query, { rejectWithValue }) => {
    try {
      const response = await videoAPI.searchVideos(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

const videoSlice = createSlice({
  name: 'videos',
  initialState: {
    videos: [],
    currentVideo: null,
    searchResults: [],
    isLoading: false,
    error: null,
    uploadProgress: 0,
  },
  reducers: {
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch videos cases
      .addCase(fetchVideos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch video by ID cases
      .addCase(fetchVideoById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Upload video cases
      .addCase(uploadVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.videos.unshift(action.payload);
        state.uploadProgress = 0;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })
      // Like video cases
      .addCase(likeVideo.fulfilled, (state, action) => {
        if (state.currentVideo && state.currentVideo.id === action.payload.id) {
          state.currentVideo = { ...state.currentVideo, ...action.payload.data };
        }
      })
      // Dislike video cases
      .addCase(dislikeVideo.fulfilled, (state, action) => {
        if (state.currentVideo && state.currentVideo.id === action.payload.id) {
          state.currentVideo = { ...state.currentVideo, ...action.payload.data };
        }
      })
      // Search videos cases
      .addCase(searchVideos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentVideo, clearSearchResults, clearError, setUploadProgress } = videoSlice.actions;
export default videoSlice.reducer;