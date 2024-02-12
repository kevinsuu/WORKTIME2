// SetPassword.js
import React, { useState } from "react";
import "./fonts.css"; // Import the CSS file with font-face rule
import { useNavigate } from "react-router-dom"; // Import useNavigate

import { Button, OutlinedInput, Box, Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const SetPassword = () => {
  const [homPagePassword, setHomPagePassword] = useState("");
  const [orderDelPassword, setOrderDelPassword] = useState("");
  const [isSnackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleWorkReportSubmit = async () => {
    try {
      const requestData = [
        {
          values: orderDelPassword,
          execution: "work",
        },
        {
          values: homPagePassword,
          execution: "home",
        },
      ];
      const response = await fetch(process.env.REACT_APP_API_BASE_URL + "/api/passwords", {
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

  const navigate = useNavigate(); // Initialize the useNavigate hook
  const handleCancelClick = () => {
    navigate("/"); // Navigate back to the home page
  };

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
        密碼設定
      </Typography>
      <OutlinedInput
        placeholder="首頁功能密碼"
        value={homPagePassword}
        onChange={(e) => setHomPagePassword(e.target.value)}
        sx={{
          marginBottom: "20px",
          width: "300px",
          backgroundColor: "white", // Set the background color to white for the input
        }}
      />
      <OutlinedInput
        placeholder="報工單刪除密碼"
        value={orderDelPassword}
        onChange={(e) => setOrderDelPassword(e.target.value)}
        sx={{
          marginBottom: "20px",
          width: "300px",
          backgroundColor: "white", // Set the background color to white for the input
        }}
      />
      <Box sx={{ padding: "12px" }}>
        <Button variant="contained" color="primary" onClick={handleWorkReportSubmit} sx={{ marginLeft: "20px", backgroundColor: "#503C3C" }}>
          設定
        </Button>
        <Button variant="contained" color="primary" onClick={handleCancelClick} sx={{ marginLeft: "20px", backgroundColor: "#503C3C" }}>
          取消
        </Button>
      </Box>
      <Snackbar open={isSnackbarOpen} autoHideDuration={1500} onClose={() => setSnackbarOpen(false)}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbarOpen(false)} severity="success">
          密碼已更新
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default SetPassword;
