import { Paper, Typography, Button } from "@mui/material";
import React,{useContext} from "react";
import Logo from "../../assets/Logo.png";
import { AuthContext } from "../../App";

function Navbar() {
    const {isLoggedIn} = useContext(AuthContext)
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
        <img src={Logo} width={50} height={50} />
        <Typography variant="h4" color="white">
          To Do Today
        </Typography>
      </div>
      {isLoggedIn ? <Button variant="contained">Sign Out</Button>:""}
    </Paper>
  );
}

export default Navbar;
