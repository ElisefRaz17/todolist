import { configureStore } from '@reduxjs/toolkit';
import { todoReducer } from './todos/todoSlice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppDispatch = typeof store.dispatch
export default store;