import { createSlice } from '@reduxjs/toolkit';
import { fetchTodos } from './fetchTodos';
    
const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: [],
    loading: false,
    error: null,
    statusCode:null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state:any, action) => {
        state.loading = false;
        state.todos = action.payload;
        state.statusCode = 200;
      })
      .addCase(fetchTodos.rejected, (state:any, action:any) => {
        state.loading = false;
        state.error = action.error.message;
        state.statusCode= action.payload?.status || 500
      });
  },
});

export const todoReducer = todoSlice.reducer;