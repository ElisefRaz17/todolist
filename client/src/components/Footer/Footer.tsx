import { Paper, Typography } from "@mui/material";
import React from "react";

function Footer() {
  return (
    <Paper aria-label="footer" sx={{backgroundColor:'#253C78', justifyContent:'center', padding:'10px', display:'flex'}}>
      <Typography color="white"variant="body1">© Copyright 2025 Created by Elise</Typography>
    </Paper>
  );
}
export default Footer;
