// SetSleep.js
import React, { useState } from "react";
import "./fonts.css"; // Import the CSS file with font-face rule
import { useNavigate } from "react-router-dom"; // Import useNavigate

import { Button, OutlinedInput, Box, Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const SetSleep = () => {
  const [sleepTime, setSleepTime] = useState("");
  const [isSnackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleWorkReportSubmit = async () => {
    try {
      const requestData = {
        time: sleepTime,
      };
      const response = await fetch(process.env.REACT_APP_API_BASE_URL + "/api/sleeps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData), // 将请求数据转换为 JSON 字符串
      });
      if (response.ok) {
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "300px",
        minWidth: "500px",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "20px", color: "#503C3C", fontWeight: "bold" }}>
        休息時間設定
      </Typography>

      <Box sx={{ padding: "12px" }}>
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
        <Button variant="contained" color="primary" onClick={handleWorkReportSubmit} sx={{ marginLeft: "20px", backgroundColor: "#503C3C" }}>
          設定
        </Button>
      </Box>
      <Snackbar open={isSnackbarOpen} autoHideDuration={1500} onClose={() => setSnackbarOpen(false)}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbarOpen(false)} severity="success">
          休息時間已設定
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default SetSleep;
