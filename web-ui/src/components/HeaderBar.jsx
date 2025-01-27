// src/components/HeaderBar.jsx

import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
// Optionally import an Icon, like Menu:
// import MenuIcon from "@mui/icons-material/Menu";
// You can also import IconButton, etc., if you want a nav menu

function HeaderBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Optional Menu Button
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Faustus Price Checker
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default HeaderBar;
