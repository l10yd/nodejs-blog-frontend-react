import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

//запрос на комментарии к статье (по ее id)
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId) => {
    const { data } = await axios.get(`/comments/${postId}`);
    return data;
  }
);

//запрос на последние 5 комментариев из бд
export const fetchLastComments = createAsyncThunk(
  "comments/fetchLastComments",
  async () => {
    const { data } = await axios.get(`/comments`);
    return data;
  }
);

const initialState = {
  comments: {
    items: [],
    status: "loading",
  },
  lastComments: {
    items: [],
    status: "loading",
  },
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //достраиваем получение коммментариев к статье по id
      .addCase(fetchComments.pending, (state) => {
        state.comments.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments.items = action.payload;
        state.comments.status = "loaded";
      })
      .addCase(fetchComments.rejected, (state) => {
        state.comments.items = [];
        state.comments.status = "error";
      })
      //получение последних 5 комментариев из бд
      .addCase(fetchLastComments.pending, (state) => {
        state.lastComments.status = "loading";
      })
      .addCase(fetchLastComments.fulfilled, (state, action) => {
        state.lastComments.items = action.payload;
        state.lastComments.status = "loaded";
      })
      .addCase(fetchLastComments.rejected, (state) => {
        state.lastComments.items = [];
        state.lastComments.status = "error";
      });
  },
});

export const commentsReducer = commentsSlice.reducer;
