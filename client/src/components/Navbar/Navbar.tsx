import { Paper, Typography, Button } from "@mui/material";
import React from "react";
import Logo from "../../assets/Logo.png";
import { useAuth } from "../../App";
import { useNavigate } from "react-router-dom";

function Navbar() {
const {logout,token} = useAuth()
const navigate = useNavigate()
const handleLogout = () => {
    logout();
    navigate("/login")
};
  return (
    <Paper
      sx={{
        backgroundColor: "#253C78",
        padding: 2,
        display: "flex",
        gap: "2rem",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap:'2rem' }}>
        <img src={Logo} width={50} height={50} alt="logo"/>
        <Typography variant="h4" color="white">
          To Do Today
        </Typography>
      </div>
       {token && <Button variant="contained" onClick={handleLogout}>Sign Out</Button>}
    </Paper>
  );
}

export default Navbar;
