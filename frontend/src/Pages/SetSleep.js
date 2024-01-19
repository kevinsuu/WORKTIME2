// SetSleep.js
import React, { useState } from "react";
import "./fonts.css"; // Import the CSS file with font-face rule
import { useNavigate } from "react-router-dom"; // Import useNavigate

import { Button, OutlinedInput, Box, Typography } from "@mui/material";

const SetSleep = () => {
  const [sleepTime, setSleepTime] = useState("");

  const handleWorkReportSubmit = () => {
    console.log("Submitting work report:", sleepTime);
  };

  const navigate = useNavigate();
  const handleCancelClick = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "20%",
        left: "40%",
        display: "flex",
        minHeight: "300px",
        minWidth: "500px",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Typography
        variant="h5"
        sx={{ marginBottom: "20px", color: "#503C3C", fontWeight: "bold" }}
      >
        休息時間設定
      </Typography>
      <OutlinedInput
        placeholder="設定休息時間(小時)"
        value={sleepTime}
        onChange={(e) => setSleepTime(e.target.value)}
        sx={{
          marginBottom: "20px",
          width: "300px",
          backgroundColor: "white", // Set the background color to white for the input
        }}
      />

      <Box sx={{ padding: "12px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleWorkReportSubmit}
          sx={{ marginLeft: "20px", backgroundColor: "#503C3C" }}
        >
          設定
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCancelClick}
          sx={{ marginLeft: "20px", backgroundColor: "#503C3C" }}
        >
          取消
        </Button>
      </Box>
    </Box>
  );
};

export default SetSleep;