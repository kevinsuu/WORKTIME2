// HomePage.js
import React, { useState } from "react";
import "./fonts.css"; // Import the CSS file with font-face rule

import { Button, OutlinedInput } from "@mui/material";

const HomePage = () => {
  const [workReportContent, setWorkReportContent] = useState("");
  const handleWorkReportSubmit = () => {
    console.log("Submitting work report:", workReportContent);
  };

  return (
    <div>
      <h1>這裡是首頁</h1>
      <OutlinedInput
        placeholder="報工內容"
        value={workReportContent}
        onChange={(e) => setWorkReportContent(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleWorkReportSubmit}
      >
        1231231
      </Button>
    </div>
  );
};

export default HomePage;
