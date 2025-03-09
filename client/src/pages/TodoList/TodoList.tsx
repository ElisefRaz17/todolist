import React, { useContext, useEffect, useRef, useState } from "react";
import { parseISO, format } from "date-fns";
import "../Home/home.css";
import dayjs from "dayjs";
import { AuthContext } from "../../App";
import {
  Button,
  Card,
  Toolbar,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { Add, Cancel, Delete, Edit, Save } from "@mui/icons-material";
import {
  GridColDef,
  GridRenderCellParams,
  GridActionsCellItem,
  DataGrid,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowModel,
  GridRowModesModel,
  GridRowId,
  GridRowModes,
} from "@mui/x-data-grid";
import axios from "axios";
import NewForm from "./NewForm";

const TodoListForm = () => {
  const apiRef = useRef<any>(null);
  const { credentialsState } = useContext(AuthContext);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [userId, setUserId] = useState<any>(null);
  const [token, setToken] = useState<any>(null);
  const [openForm, setOpenForm] = useState(false);
  const [status, setStatus] = useState("Not Started");
  const [username, setUsername] = useState<any>("");
  const [todos, setTodos] = useState([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [formData, setFormData] = useState<any>({
    name: "",
    deadline: "",
    status: `${status}`,
    description: "",
    user: `${userId}`,
  });

  useEffect(() => {
    // if (token) {
    try {
      let token: any = localStorage.getItem("token");
      setToken(token);
    } catch (error) {
      let token: any = localStorage.getItem("token");
      setToken(token);
    }
    let token: any = localStorage.getItem("token");
    setToken(token);
  }, []);
  console.log("Token", token);

  const [rows, setRows] = useState<any>(todos);
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeleteRow = (row: any) => {
    setRows(rows.filter((row: any) => !selectedRows.includes(row["_id"])));
  };
  const addNewTodo = (e: any) => {
    e.preventDefault();
    setFormData({
      name: "",
      deadline: "",
      status: `${status}`,
      description: "",
      user: `${userId}`,
    });

    fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(formData),
    }).then((response) => console.log(response.json()));
  };
  const fetchTodos = async () => {
    fetch(`http://localhost:5000/todos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setRows(data));
  };
  const handleEditClick = (_id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [_id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (_id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [_id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (_id: GridRowId) => () => {
    setRows(rows.filter((row:any) => row._id !== _id));
  };

  const handleCancelClick = (_id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [_id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row:any) => row._id === _id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row:any) => row._id !== _id));
    }
  };
  useEffect(() => {
    // if (userId) {
    //   fetchTodos();

    //   // setUsername(user.username);
    // }

    fetchTodos();
  }, []);

  const columns: GridColDef[] = [
    { field: "status", headerName: "Status", type: "string", width: 70, editable:true },
    {
      field: "deadline",
      headerName: "Deadline",
      type: "date",
      width: 120,
      valueFormatter: (params: any) => {
        if (!params.value) {
          return "";
        }

        try {
          const parsedDate = parseISO(params.value);
          return format(parsedDate, "yyyy-MM-dd");
        } catch (error) {
          console.error("Error parsing date:", error);
          return "Invalid Date";
        }
      },
      renderCell: (params: GridRenderCellParams) => {
        return dayjs(params.value).format("YYYY-MM-DD"); // Format the date as needed
      },
      editable: true,
    },
    { field: "name", headerName: "Name", type: "string", width: 130 },
    {
      field: "description",
      headerName: "Description",
      type: "string",
      width: 130,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
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
  const handleCloseForm = (e: any) => {
    e.preventDefault();
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
  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(
      rows.map((row: { _id: any }) => (row._id === newRow._id ? updatedRow : row))
    );
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  console.log("Data Grid rows", rows);

  return (
    <Paper sx={{width:'100%'}}>
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
          rows={rows}
          columns={columns}
          getRowId={(row) => row["_id"]}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
        />
      </Card>
      <NewForm
        handleChange={handleChange}
        formData={formData}
        status={status}
        addNewTodo={addNewTodo}
        open={openForm}
        onClose={handleCloseForm}
      />
    </Paper>
  );
};
export default TodoListForm;
