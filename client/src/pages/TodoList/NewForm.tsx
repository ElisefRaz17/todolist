import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Logo from "../../assets/AddNew.png";
import React from "react";

function NewForm(props: any) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    overflowY: "auto",
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    alignItems: "center",
    borderRadius: "8px",
  };

  return (
    <>
      <Modal open={props.open} onClose={props.onClose}>
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <img src={Logo} height={50} width={50} alt="Logo" />
            <Typography
              variant="h4"
              sx={{ textAlign: "center", fontFamily: "monospace" }}
            >
              Add ToDo
            </Typography>
          </Box>
          <form
            onSubmit={props.addNewTodo}
            className="todo-form"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <input hidden value={props.formData.user} name="user" />
            <TextField
              name="name"
              value={props.formData.name}
              label="Name"
              InputLabelProps={{ shrink: true }}
              placeholder="ex: Schedule Scrum Meeting"
              sx={{ maxWidth: "300px" }}
              onChange={props.handleChange}
            />
            <TextField
              name="deadline"
              value={props.formData.deadline}
              label="Deadline"
              type="date"
              InputLabelProps={{ shrink: true }}
              sx={{ maxWidth: "300px" }}
              onChange={props.handleChange}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                id="demo-simple-select"
                value={props.formData.status}
                name="status"
                label="Status"
                onChange={props.handleChange}
              >
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="Complete">Complete</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="description"
              label="Description"
              multiline
              placeholder="ex: We will review current project status"
              value={props.formData.description}
              InputLabelProps={{ shrink: true }}
              onChange={props.handleChange}
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
    </>
  );
}

export default NewForm;
