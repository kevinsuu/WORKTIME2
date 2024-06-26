// App.js
import React from "react";
import Sidebar from "./Sidebar";
import StartWork from "./Pages/StartWork";
import SetSleep from "./Pages/SetSleep";
import HomePage from "./Pages/HomePage";
import CompleteWork from "./Pages/CompleteWork";
import DataMaintain from "./Pages/DataMaintain";
import DataExport from "./Pages/DataExport";
import SetPassword from "./Pages/SetPassword";
import WorkPage from "./Pages/WorkPage";
import EditWorkPage from "./Pages/EditWorkPage";
import CreateWork from "./Pages/CreateWork";

import Grid from "@mui/material/Grid";
import "./Pages/fonts.css"; // Import the CSS file with font-face rule

import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Routes

function App() {
  const mainContentStyles = {
    backgroundColor: "#EBE3D5",
    minHeight: "100%",
    minWidth: "100%",
  };

  return (
    <Router>
      <Grid container sx={mainContentStyles}>
        <Grid item xs={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={10}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/startWork" element={<StartWork />} />
            <Route path="/completeWork" element={<CompleteWork />} />
            <Route path="/dataMaintain" element={<DataMaintain />} />
            <Route path="/dataExport" element={<DataExport />} />
            <Route path="/setPassword" element={<SetPassword />} />
            <Route path="/setSleep" element={<SetSleep />} />
            <Route path="/work/:workNumber" element={<WorkPage />} />
            <Route path="/editWork/:workNumber" element={<EditWorkPage />} />
            <Route path="/createWork" element={<CreateWork />} />
          </Routes>
        </Grid>
      </Grid>
    </Router>
  );
}

export default App;
