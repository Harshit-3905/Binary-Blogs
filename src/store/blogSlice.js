import { createSlice } from "@reduxjs/toolkit";

const blogs = {
  status: false,
  blogs: null,
  trendingBlogs: [],
};

const blogSlice = createSlice({
  name: "blogs",
  initialState: blogs,
  reducers: {
    populateBlogs(state, action) {
      state.status = true;
      state.blogs = action.payload;
    },
    setTrendingBlogs(state, action) {
      // New action
      state.trendingBlogs = action.payload;
    },
  },
});

export const { populateBlogs, setTrendingBlogs } = blogSlice.actions;
export default blogSlice.reducer;
