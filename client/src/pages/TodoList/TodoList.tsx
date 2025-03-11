import React, { useEffect, useState } from "react";
import "../Home/home.css";
import {
  Button,
  Card,
  Toolbar,
  Paper,
  Alert,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import { Add, Cancel, Check, Delete, Edit, Save } from "@mui/icons-material";
import {
  GridColDef,
  GridActionsCellItem,
  DataGrid,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowModel,
  GridRowModesModel,
  GridRowId,
  GridRowModes,
} from "@mui/x-data-grid";
import NewForm from "./NewForm";
import {
  deadlineColumn,
  descriptionColumn,
  nameColumn,
  statusColumn,
} from "./TableColumns";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../actions/store";
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
} from "../../actions/todos/fetchTodos";

const TodoListForm = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, loading, error, statusCode } = useSelector(
    (state: RootState) => state.todos
  );
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [rows, setRows] = useState<any>([]);
  const [userId, setUserId] = useState<any>(null);
  const [token, setToken] = useState<any>(null);
  const [openForm, setOpenForm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    deadline: "",
    status: "",
    description: "",
    user: `${userId}`,
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      let token: any = localStorage.getItem("token");
      setToken(token);
    }
  }, []);

  const handleChange = (e: any) => {
    // setFormData({ ...formData, [e.target.name]: e.target.value });
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addNewTodo = async (e: any) => {
    e.preventDefault();
    setFormData({
      name: "",
      deadline: "",
      status: "",
      description: "",
      user: `${userId}`,
    });
    await dispatch(createTodo(formData));
    if (statusCode === 200) {
      dispatch(fetchTodos());
      handleCloseForm();
      setOpenSuccess(true)
    }
  };
  const handleEditClick = (_id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [_id]: { mode: GridRowModes.Edit } });
  };
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccess(false);
  };

  const handleSaveClick = (_id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [_id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (_id: GridRowId) => async () => {
    todos.filter((row: any) => row._id !== _id);
    await dispatch(deleteTodo(_id));
    dispatch(fetchTodos());
  };

  const handleCancelClick = (_id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [_id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row: any) => row._id === _id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row: any) => row._id !== _id));
    }
  };
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const columns: GridColDef[] | any = [
    statusColumn,
    deadlineColumn,
    nameColumn,
    descriptionColumn,
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id, row }: any) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              key={`save-${id}`}
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              key={`cancel-${id}`}
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Edit sx={{color:'#13274F'}}/>}
            label="Edit"
            key={`edit-${id}`}
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Delete sx={{color:'#13274F'}} />}
            label="Delete"
            key={`edit-${id}`}
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleOpenForm = (e: any) => {
    e.preventDefault();
    setOpenForm(true);
  };
  const handleCloseForm = () => {
    setOpenForm(false);
  };
  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    dispatch(updateTodo(newRow));

    const updatedRow = { ...newRow };
    setRows(rows.map((row: any) => (row._id === newRow._id ? newRow : row)));

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <Card
        sx={{
          height: 500,
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <Toolbar>
          <Button color="primary" startIcon={<Add />} onClick={handleOpenForm}>
            Add Todo
          </Button>
        </Toolbar>
        <DataGrid
          rows={todos}
          columns={columns}
          getRowId={(row) => row["_id"]}
          autoHeight={true}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => {
            console.error("Error updating row:", error);
          }}
        />
      </Card>
      <NewForm
        handleChange={handleChange}
        formData={formData}
        addNewTodo={addNewTodo}
        open={openForm}
        onClose={handleCloseForm}
      />
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Todo Successfully created!
        </Alert>
      </Snackbar>
    </Paper>
  );
};
export default TodoListForm;
