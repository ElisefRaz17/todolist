import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { parseISO, format } from "date-fns";
import "../Home/home.css";
import dayjs from "dayjs";
import { AuthContext } from "../../App";
import { Button, Card, Toolbar, Paper, Typography, Box } from "@mui/material";
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
  const [selectedTodo, setSelectedTodo] = useState<any>(null);
  const [todoContent, setTodoContent] = useState<any>([]);
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

  const [rows, setRows] = useState<any>([]);
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  // const handleSaveClick = (_id: any, row: any) => async () => {
  //   const row = rows.find((r: any) => r._id === _id);
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:5000/todos/${_id}`,
  //       row,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     if (response.status !== 200) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     fetchTodos(); // Refresh data after successful update
  //     setRowModesModel({
  //       ...rowModesModel,
  //       [_id]: { mode: GridRowModes.View },
  //     });
  //   } catch (error) {
  //     console.error("Error updating todo:", error);
  //     // Handle error appropriately, e.g., show a notification to the user
  //   }
  // };
  const handleSaveClick = (_id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [_id]: { mode: GridRowModes.View } });
  }

  //   fetch(`http://localhost:5000/todos/${_id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `${token}`,
  //     },
  //     body: JSON.stringify({ todoContent }),
  //   }).then((response) => console.log(response.json()));
  // };

  const handleDeleteClick = (_id: GridRowId) => async () => {
    setRows(rows.filter((row: any) => row._id !== _id));
    const response = await axios.delete(
      `http://localhost:5000/todos/${_id}`,
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
    // if (userId) {
    //   fetchTodos();

    //   // setUsername(user.username);
    // }

    fetchTodos();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "status",
      headerName: "Status",
      type: "string",
      width: 70,
      editable: true,
    },
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
    {
      field: "name",
      headerName: "Name",
      type: "string",
      width: 130,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      type: "string",
      width: 130,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
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
            icon={<Edit />}
            label="Edit"
            key={`edit-${id}`}
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Delete />}
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

  const processRowUpdate = async (newRow: GridRowModel) => {
  
      const response = await axios.put(
        `http://localhost:5000/todos/${newRow._id}`,
        newRow,
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
    

    const updatedRow = { ...newRow };
    setRows(
      rows.map((row:any) => (row._id === newRow._id ? response.data : row))
    );

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  console.log("Data Grid rows", rows);

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
          rows={rows}
          columns={columns}
          getRowId={(row) => row["_id"]}
          autoHeight={true}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          // processRowUpdate={(newRow, oldRow) => {
          //   // Update your data source here (e.g., using useState or an API call)
          //   const updatedRows = rows.map((row:any) =>
          //     row._id === newRow._id ? newRow.data : row
          //   );
          //   setRows(updatedRows); // Update the state
          //   return newRow.data; // Return the updated row
          // }}
          onProcessRowUpdateError={(error) => {
            console.error("Error updating row:", error);
          }}
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
