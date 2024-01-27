// DataExport.js
import React, { useState } from "react";
import "./fonts.css"; // Import the CSS file with font-face rule
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Button, TextField, Box, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const DataExport = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const handleWorkReportSubmit = () => {
    console.log("Submitting work report:", startTime, endTime);
  };

  const navigate = useNavigate();
  const handleCancelClick = () => {
    navigate("/");
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
        資料匯出作業
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="起始日期"
          sx={{ background: "white" }}
          padding="4px"
          value={startTime}
          onChange={(newValue) => {
            setStartTime(newValue);
          }}
          TextFieldComponent={(props) => (
            <FormControl>
              <InputLabel>起始日期</InputLabel>
              <TextField {...props} variant="standard" />
            </FormControl>
          )}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="結束日期"
          padding="4px"
          sx={{ background: "white" }}
          value={endTime}
          onChange={(newValue) => {
            setEndTime(newValue);
          }}
          TextFieldComponent={(props) => (
            <FormControl>
              <InputLabel>結束日期</InputLabel>
              <TextField {...props} variant="standard" />
            </FormControl>
          )}
        />
      </LocalizationProvider>
      <Box sx={{ padding: "12px" }}>
        <Button variant="contained" color="primary" onClick={handleWorkReportSubmit} sx={{ marginLeft: "20px", backgroundColor: "#503C3C" }}>
          匯出
        </Button>
        <Button variant="contained" color="primary" onClick={handleCancelClick} sx={{ marginLeft: "20px", backgroundColor: "#503C3C" }}>
          取消
        </Button>
      </Box>
    </Box>
  );
};

export default DataExport;
