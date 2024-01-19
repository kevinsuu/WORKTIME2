// CompleteWork.js
import React, { useState } from "react";
import "./fonts.css"; // Import the CSS file with font-face rule

import { Button, OutlinedInput } from "@mui/material";

const CompleteWork = () => {
  const [workReportContent, setWorkReportContent] = useState("");
  const handleWorkReportSubmit = () => {
    console.log("Submitting work report:", workReportContent);
  };

  return (
    <div>
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
        提交報工
      </Button>
    </div>
  );
};

export default CompleteWork;
