import React, { ChangeEvent, useRef, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  Button,
  Modal,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Card,
  CardContent,
  Box,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Logo from "../../assets/AddNew.png";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { parseISO, format } from "date-fns";
import "./home.css";
import dayjs from "dayjs";
import { Edit } from "@mui/icons-material";
import {v4 as uuidv4} from "uuid"
import axios from "axios";
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
function Home() {
  const apiRef = useRef(null);
  let rowIdCounter = 1;
  const [openForm, setOpenForm] = useState(false);
  const [status, setStatus] = useState("Not Started");
  const [formData, setFormData] = useState({
    name: "",
    deadline: "",
    status: `${status}`,
    description: "",
  });
  const [rows, setRows] = useState<any>([]);
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const addToDatabase = async(e:any) => {
    e.preventDefault()
    try{
      const response = await axios.post('http://localhost:500/addTodo',{
        formData
      })

    }catch(error){
      console.log("Adding Todo to Database failed: ", error)
    }
  }
  const addNewTodo = (e: any) => {
    e.preventDefault();
    const newRow = { id: uuidv4(), ...formData };
    setRows([...rows, newRow]);
    setFormData({ name: "", deadline: "", status: `${status}`, description: "" });
    addToDatabase(e)
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", type: "string", width: 70 },
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
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
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
}

export default Home;
