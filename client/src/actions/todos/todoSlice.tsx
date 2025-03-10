import { createSlice } from '@reduxjs/toolkit';
import { fetchTodos } from './fetchTodos';
    
const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state:any, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const todoReducer = todoSlice.reducer;