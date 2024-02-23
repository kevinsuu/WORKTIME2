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
  const defaultDate = new Date(2020, 0, 1);
  const toDayDate = new Date();
  const [startTime, setStartTime] = useState(defaultDate);
  const [endTime, setEndTime] = useState(toDayDate);
  const handleWorkReportSubmit = async () => {
    const requestBody = {
      startTime: startTime.toISOString(), // 将日期转换为 ISO 格式的字符串
      endTime: endTime.toISOString(),
    };

    try {
      const response = await fetch(process.env.REACT_APP_API_BASE_URL + "/api/exportLists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const blob = await response.blob();
        // 创建一个临时URL
        const url = URL.createObjectURL(blob);

        const currentDate = new Date();
        const fileName = `報工資料_${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}.xlsx`;

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = fileName;

        // 将链接添加到DOM中并模拟点击
        document.body.appendChild(a);
        a.click();

        // 释放URL对象
        URL.revokeObjectURL(url);

        console.log("Export successful");
      } else {
        console.error("Export failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during export:", error);
    }
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
