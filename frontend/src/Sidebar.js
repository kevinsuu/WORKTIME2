// Sidebar.js
import React, { useState } from "react";
import {
  List,
  Snackbar,
  ListItemButton,
  ListItemText,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SnackbarAlert from "./Component/SnackbarAlert";

const Sidebar = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [isSnackbarMessage, setSnackbarMessage] = useState("");
  const [isSnackbarStatus, setSnackbarStatus] = useState("");

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const navigate = useNavigate();

  const handleDialogClose = () => {
    setDialogOpen(false);
    setPassword("");
    navigate("/");
  };
  const handleDialogCheck = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_BASE_URL + "/api/passwords", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        let homePassword = "";
        for (const password of responseData) {
          if (password.execution === "home") {
            homePassword = password.values;

            break; // 找到后可以提前结束循环
          }
        }
        setSnackbarOpen(true);

        if (homePassword == password) {
          setPassword("");
          setSnackbarMessage("密碼正確");
          setSnackbarStatus("success");
        } else {
          setSnackbarMessage("密碼錯誤");
          setSnackbarStatus("error");
          navigate("/");
        }
      }
      setDialogOpen(false);
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#776B5D",
        color: "white",
        height: "100%",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)", // 添加陰影
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar alt="公司logo" src="/SM-2.png" sx={{ width: 200, height: 80, marginTop: "12px", marginRight: "8px", borderRadius: 0 }} />

      <Box sx={{ padding: "12px", fontSize: "24px", color: "#3E3232" }}>報工2.0</Box>

      <List sx={{ width: "100%" }}>
        <ListItemButton
          component={Link}
          to="/"
          sx={{
            marginBottom: "8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#B0A695" },
            borderBottom: "1px solid #3E3232",
          }}
        >
          <ListItemText primary="首頁" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/startWork"
          sx={{
            marginBottom: "8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#B0A695" },
            borderBottom: "1px solid #3E3232",
          }}
        >
          <ListItemText primary="開始報工" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/completeWork"
          sx={{
            marginBottom: "8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#B0A695" },
            borderBottom: "1px solid #3E3232",
          }}
        >
          <ListItemText primary="完成報工" />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/dataMaintain"
          onClick={handleDialogOpen}
          sx={{
            marginBottom: "8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#B0A695" },
            borderBottom: "1px solid #3E3232",
          }}
        >
          <ListItemText primary="資料維護作業" />
          <LockIcon />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/dataExport"
          onClick={handleDialogOpen}
          sx={{
            marginBottom: "8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#B0A695" },
            borderBottom: "1px solid #3E3232",
          }}
        >
          <ListItemText primary="資料匯出作業" />
          <LockIcon />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/setPassword"
          onClick={handleDialogOpen}
          sx={{
            marginBottom: "8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#B0A695" },
            borderBottom: "1px solid #3E3232",
          }}
        >
          <ListItemText primary="密碼設定" />
          <LockIcon />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/createWork"
          onClick={handleDialogOpen}
          sx={{
            marginBottom: "8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#B0A695" },
            borderBottom: "1px solid #3E3232",
          }}
        >
          <ListItemText primary="新建製令單作業" />
          <LockIcon />
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/setSleep"
          onClick={handleDialogOpen}
          sx={{
            marginBottom: "8px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#B0A695" },
            borderBottom: "1px solid #3E3232",
          }}
        >
          <ListItemText primary="休息時間設定" />
          <LockIcon />
        </ListItemButton>
      </List>
      {isDialogOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#3E3232", // Adjust the color and opacity as needed
            zIndex: 999,
          }}
        />
      )}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>請輸入密碼</DialogTitle>
        <DialogContent>
          <FormControl>
            <TextField type="password" value={password} onChange={handlePasswordChange} />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>取消</Button>
          <Button onClick={handleDialogCheck} color="primary">
            確認
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarAlert open={isSnackbarOpen} message={isSnackbarMessage} status={isSnackbarStatus} handleClose={() => setSnackbarOpen(false)} />
    </Box>
  );
};

export default Sidebar;
