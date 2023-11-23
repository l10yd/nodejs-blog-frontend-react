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

const initialState = {
  comments: {
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
      });
  },
});

export const commentsReducer = commentsSlice.reducer;
