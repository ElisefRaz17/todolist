import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTodos = createAsyncThunk<any>("data/fetchTodos", async () => {
  const response = await fetch(
    `${process.env["REACT_APP_BACKEND_PORT"]}/todos`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
  const data = await response.json();
  return data;
});

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (newItem) => {
    const response = await axios.post(
      `${process.env["REACT_APP_BACKEND_PORT"]}/todos`,
      JSON.stringify(newItem),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data
  }
);
export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (updatedTodo: any) => {
    const response = await axios.put(
      `${process.env["REACT_APP_BACKEND_PORT"]}/todos/${updatedTodo._id}`,
      updatedTodo,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token") || ""}`,
        },
      }
    );
    return response.data;
  }
);

export const deleteTodo = createAsyncThunk(
  "todo/deleteTodo",
  async (deletedId: any) => {
    const response = await axios.delete(
      `${process.env["REACT_APP_BACKEND_PORT"]}/todos/${deletedId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
);
