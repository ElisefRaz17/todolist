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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { parseISO, format } from "date-fns";
import "./home.module.css";
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
  const [name, setName] = useState<string>("");
  const [deadline, setDeadline] = useState<string>();
  const [status, setStatus] = useState("Not Started");
  const [description, setDescription] = useState("");
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", type: "string", width: 70 },
    { field: "status", headerName: "Status", type: "string", width: 70 },
    {
      field: "deadline",
      headerName: "Deadline",
      type: "date",
      width: 120,
      valueFormatter: (params: any) => {
        if (!params.value) return "";
        const date = parseISO(params.value);
        return format(date, "dd/MM/yyyy");
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
  const rows = [
    {
      id: 1,
      name: "Test",
      description: "Description",
      status: false,
      deadline: "12/25/2025",
    },
  ];
  const addNewRow = () => {
    // const newRow = {id:rowIdCounter++,}
  };
  const handleOpenForm = (e: any) => {
    e.preventDefault();
    setOpenForm(true);
  };
  const handleCloseForm = (e: any) => {
    e.preventDefault();
    setOpenForm(false);
  };
  const handleStatusChange = (e: SelectChangeEvent) => {
    setStatus(e.target.value as string);
  };
  const addNewTodo = (e: any) => {
    e.preventDefault();
  };
  return (
    <Paper>
      <Typography>Todo List</Typography>
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
              name={name}
              value={name}
              label="Name"
              InputLabelProps={{ shrink: true }}
              placeholder="ex: Schedule Scrum Meeting"
              sx={{ maxWidth: "300px" }}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              name={deadline}
              value={deadline}
              label="Deadline"
              type="date"
              InputLabelProps={{ shrink: true }}
              sx={{ maxWidth: "300px" }}
              onChange={(e) => setDeadline(e.target.value)}
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
              name={description}
              label="Description"
              multiline
              placeholder="ex: We will review current project status"
              value={description}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setDescription(e.target.value)}
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
