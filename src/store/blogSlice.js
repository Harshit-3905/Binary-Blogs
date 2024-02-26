import { createSlice } from "@reduxjs/toolkit";

const blogs = {
  status: false,
  blogs: null,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState: blogs,
  reducers: {
    populateBlogs(state, action) {
      state.status = true;
      state.blogs = action.payload;
    },
  },
});

export const { populateBlogs } = blogSlice.actions;
export default blogSlice.reducer;
