import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const SnackbarAlert = ({ open, message, status, handleClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={1500} onClose={handleClose}>
      <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={status}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default SnackbarAlert;
