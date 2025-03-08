import React, { useContext, useEffect, useRef, useState } from "react";
import Logo from "../../assets/AddNew.png";
import { parseISO, format } from "date-fns";
import "../Home/home.css";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "../../App";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {
  GridColDef,
  GridRenderCellParams,
  GridActionsCellItem,
  DataGrid,
} from "@mui/x-data-grid";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  alignItems: "center",
  borderRadius: "8px",
};
/*FIXME: Update the state variables based on backend */
const TodoListForm = ({ userId, onTodoListCreated }: any) => {
  const apiRef = useRef<any>(null);
  const { credentialsState } = useContext(AuthContext);

  const [user, setUser] = useState<any>(null);
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
  });

  useEffect(() => {
    const storedUser: any = localStorage.getItem("User");
    const token: any = localStorage.getItem("token");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(token);
      } catch (error) {
        setUser(JSON.parse(storedUser));
        setToken(token);
      }
    }
    setUser(JSON.parse(storedUser));
    setToken(token);
  }, []);

  const [rows, setRows] = useState<any | undefined>(todos);
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //   const updateTodoList = async (e: any) => {
  //     e.preventDefault();
  //     try {
  //       fetch(`http://localhost:5000/api/todos`, {
  //         method: "",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `${token}`,
  //         },
  //         body: JSON.stringify(formData),
  //       });
  //     } catch (error) {}
  //   };
  //   const addToDatabase = async (e: any) => {
  //     e.preventDefault();
  //     try {
  //       fetch(`http://localhost:5000/todos`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `${user.username}:${user.password}`,
  //         },
  //         body: JSON.stringify(formData),
  //       }).then(() => {});
  //       // const response = await axios.post('http://localhost:5000/todos',headers:{},{
  //       //   formData
  //       // })
  //     } catch (error) {
  //       console.log("Adding Todo to Database failed: ", error);
  //     }
  //   };
  //   const deleteFromData = async (id: number) => {
  //     try {
  //       fetch(`http://localhost:5000/todos/${id}`, {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `${user.username}:${user.password}`,
  //         },
  //       });
  //     } catch (error) {}
  //   };

  const handleDeleteRow = (row: any) => {
    setRows(rows.filter((row: any) => !selectedRows.includes(row["_id"])));
    // deleteFromData(row["_id"]);
  };
  const addNewTodo = (e: any) => {
    e.preventDefault();
    const newRow = { id: uuidv4(), ...formData };
    setRows([...rows, newRow]);
    setFormData({
      name: "",
      deadline: "",
      status: `${status}`,
      description: "",
    });
    // addToDatabase(e);
  };
  const fetchTodos = async () => {
    fetch(`http://localhost:5000/api/todos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setTodos(data));
    // console.log("Fetched Todos: ", response.data);
  };
  useEffect(() => {
    if (user) {
      fetchTodos();
      setUsername(user.username);
    }
  }, [user]);
  console.log("Fetched Todo Items", todos);

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", type: "string", width: 70 },
    { field: "status", headerName: "Status", type: "string", width: 70 },
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
      field: "deleteAction",

      headerName: "Actions",

      type: "actions",

      getActions: (params) => [
        <GridActionsCellItem
          icon={<Delete />}
          onClick={() => handleDeleteRow(params.row)}
          label="Delete"
        />,
      ],
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
  const handleStatusChange = (e: any) => {
    setStatus(e.target.value as string);
  };

  return (
    <Paper>
      <Typography variant="h5" fontFamily="monospace">
        Todo List
      </Typography>
      <Edit />
      <Button variant="contained" onClick={handleOpenForm}>
        Add New ToDo
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Description</TableCell>
          </TableHead>
          <TableBody>
            {todos.map((row:any) => (
              <TableRow key={row["_id"]}>
                <TableCell>
                    {row.name}
                </TableCell>
                <TableCell>
                    {row.description}
                </TableCell>
                <TableCell>
                    {row.deadline}
                </TableCell>
                <TableCell>
                    {row.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={openForm}
        onClose={handleCloseForm}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <img src={Logo} height={50} width={50} />
            <Typography
              variant="h4"
              sx={{ textAlign: "center", fontFamily: "monospace" }}
            >
              Add ToDo
            </Typography>
          </Box>
          <form
            onSubmit={addNewTodo}
            className="todo-form"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <input hidden name="username" value={username} />
            <TextField
              name="name"
              value={formData.name}
              label="Name"
              InputLabelProps={{ shrink: true }}
              placeholder="ex: Schedule Scrum Meeting"
              sx={{ maxWidth: "300px" }}
              onChange={handleChange}
            />
            <TextField
              name="deadline"
              value={formData.deadline}
              label="Deadline"
              type="date"
              InputLabelProps={{ shrink: true }}
              sx={{ maxWidth: "300px" }}
              onChange={handleChange}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="not-started">Not Started</MenuItem>
                <MenuItem value="complete">Complete</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="description"
              label="Description"
              multiline
              placeholder="ex: We will review current project status"
              value={formData.description}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              sx={{ maxWidth: "300px" }}
            />

            <Button
              variant="contained"
              type="submit"
              size="small"
              sx={{ width: "200px" }}
            >
              Add New Item
            </Button>
          </form>
        </Box>
      </Modal>
    </Paper>
  );
};
export default TodoListForm;
// const TodoListForm = ({ userId, onTodoListCreated }:any) => {
//     const [name, setName] = useState('');
//     const [description, setDescription] = useState('');
//     const [status,setStatus] = useState('')
//     const [deadline,setDeadline] = useState('')
//     const [items,setItems] = useState([])

//     const handleItemChange = (index:any, event:any) => {
//         const newItems = [...items];
//         setItems(newItems);
//     };

//     const handleAddItem = () => {
//         // setItems([...items, { text: '', completed: false }]);
//     };

//     const handleRemoveItem = (index:any) => {
//         const newItems = [...items];
//         newItems.splice(index, 1);
//         setItems(newItems);
//     };

//     const handleSubmit = async (event:any) => {
//         event.preventDefault();

//         try {
//             const response = await axios.post(`${process.env['REACT_APP_BACKEND_PORT']}/api/todos`, {
//                 name,
//                 deadline,
//                 status,
//                 description,
//                 user: userId,
//             });
//             onTodoListCreated(response.data);
//             setName('');
//             setDescription('');
//             setItems([]);
//         } catch (error) {
//             console.error('Error creating todo list:', error);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Create New Todo List</h2>
//             <div>
//                 <label>Title:</label>
//                 <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
//             </div>
//             <div>
//                 <label>Description:</label>
//                 <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
//             </div>
//             <div>
//                 <label>Items:</label>
//                 {items.map((item, index) => (
//                     <div key={index}>
//                         <input
//                             type="text"
//                             value={item}
//                             onChange={(e) => handleItemChange(index, e)}
//                             required
//                         />
//                         <button type="button" onClick={() => handleRemoveItem(index)}>
//                             Remove
//                         </button>
//                     </div>
//                 ))}
//                 <button type="button" onClick={handleAddItem}>
//                     Add Item
//                 </button>
//             </div>
//             <button type="submit">Create Todo List</button>
//         </form>
//     );
// };
