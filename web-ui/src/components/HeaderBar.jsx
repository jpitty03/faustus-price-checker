import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Box, CircularProgress, Chip } from "@mui/material";

function HeaderBar() {
  const [divineOrbPrice, setDivineOrbPrice] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSiteStatus = async () => {
      try {
        const response = await fetch("/faustus-price-checker/currencyOverview.json");
        const data = await response.json();
  
        const createdDate = data.created ? new Date(data.created) : null;
  
        const divineOrb = data.lines.find(
          (line) => line.currencyTypeName === "Divine Orb"
        );
        const price = divineOrb ? divineOrb.chaosEquivalent : "N/A";
        setDivineOrbPrice(price);

        const createdDatePST = createdDate
          ? new Date(createdDate.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }))
          : null;
  
        const now = new Date();
        const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
        setIsActive(createdDate > tenMinutesAgo);
  
        setLoading(false);
      } catch (error) {
        console.error("Error checking site status:", error);
        setLoading(false);
      }
    };
  
    checkSiteStatus();
  }, []);

  if (loading) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Faustus Price Checker
          </Typography>
          <CircularProgress color="inherit" size={24} />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Faustus Price Checker
        </Typography>
        {divineOrbPrice && (
          <Box sx={{ marginRight: 2 }}>
            <Typography variant="body1">
              Divine Orb Price: {divineOrbPrice} Chaos Orbs
            </Typography>
          </Box>
        )}
        <Chip
          label={isActive ? "Active" : "Inactive"}
          color={isActive ? "success" : "error"}
          sx={{ fontWeight: "bold" }}
        />
      </Toolbar>
    </AppBar>
  );
}

export default HeaderBar;
