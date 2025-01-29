import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Box, CircularProgress, Chip, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

function HeaderBar() {
  const [divineOrbPrice, setDivineOrbPrice] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastCreated, setLastCreated] = useState(null); // Track last created time

  // Function to fetch the latest JSON and update state
  const checkSiteStatus = async () => {
    try {
      const response = await fetch("/faustus-price-checker/currencyOverview.json");
      const data = await response.json();

      // Extract the "created" timestamp
      const createdDate = data.created ? new Date(data.created) : null;

      // Extract Divine Orb price
      const divineOrb = data.lines.find(
        (line) => line.currencyTypeName === "Divine Orb"
      );
      const price = divineOrb ? divineOrb.chaosEquivalent : "N/A";
      setDivineOrbPrice(price);

      // Convert created date to PST
      const createdDatePST = createdDate
        ? new Date(createdDate.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }))
        : null;

      // Determine if the site is "active" (created within the last 10 minutes)
      const now = new Date();
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
      const isNowActive = createdDatePST > tenMinutesAgo;

      // Update state only if the created date has changed
      if (lastCreated !== createdDatePST) {
        setIsActive(isNowActive);
        setLastCreated(createdDatePST);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error checking site status:", error);
      setLoading(false);
    }
  };

  // Auto-refresh every 15 seconds
  useEffect(() => {
    checkSiteStatus(); // Fetch immediately on mount

    const intervalId = setInterval(checkSiteStatus, 15000); // Poll every 15 sec

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [lastCreated]); // Runs whenever lastCreated changes

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Faustus Price Checker
        </Typography>

        {loading ? (
          <CircularProgress color="inherit" size={24} />
        ) : (
          <>
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
              sx={{ fontWeight: "bold", marginRight: 2 }}
            />
            {/* Manual Refresh Button */}
            <IconButton color="inherit" onClick={checkSiteStatus}>
              <RefreshIcon />
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default HeaderBar;
