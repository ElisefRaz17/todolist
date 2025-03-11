import { Paper, Typography, Button } from "@mui/material";
import React from "react";
import Logo from "../../assets/Logo.png";
import AppTitle from "../../assets/AppTitle.png";
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
        <img src={AppTitle} width={104} height={104} alt="app-name"/>
      </div>
       {token && <Button variant="contained" onClick={handleLogout}>Sign Out</Button>}
    </Paper>
  );
}

export default Navbar;
