// WorkPage.js
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./fonts.css"; // Import the CSS file with font-face rule
import { useNavigate } from "react-router-dom"; // Import useNavigate
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import {
  FormControl,
  MenuItem,
  Select,
  CircularProgress,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DatePicker, TimePicker } from "@mui/lab";

import SnackbarAlert from "../Component/SnackbarAlert";
import TableCellWithText from "../Component/TableCellWithText";

import { styled, Box, Typography, Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from "@mui/material";
const StyledTableContainer = styled(TableContainer)({
  marginTop: 2,
});

const StyledTable = styled(Table)({
  minWidth: 650, // 调整表格的最小宽度
});
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  padding: "4px 12px", // 調整內邊距
  width: "10%",
}));
const StyledMemberTableCell = styled(TableCell)(({ theme }) => ({
  borderTop: "1px solid #ccc", // Corrected border-right to borderRight
  padding: "4px 12px",
  width: "10%",
}));
const EditWorkPage = () => {
  const navigate = useNavigate();
  const { workNumber } = useParams();
  const [workInfo, setWorkInfo] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [isSnackbarMessage, setSnackbarMessage] = useState("");
  const [isSnackbarStatus, setSnackbarStatus] = useState("");
  const [employeeDataLoaded, setEmployeeDataLoaded] = useState(false);
  const [workDataLoaded, setWorkDataLoaded] = useState(false);
  const [employeeInput, setEmployeeInput] = useState("");
  const [moNumber, setMoNumber] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteEmployeeDialog, setOpenDeleteEmployeeDialog] = useState(false);
  const [openCompleteWorkDialog, setCompleteWorkDialog] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [completedQuantity, setCompletedQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editingWorkNumber, setEditingWorkNumber] = useState("");
  const [editingProductionQuantity, setEditingProductionQuantity] = useState("");
  // const [editedEmployeeEndTime, setEditedEmployeeEndTime] = useState("");
  // const [editedEmployeeStartTime, setEditedEmployeeStartTime] = useState("");
  const [editedEmployeeStartTimes, setEditedEmployeeStartTimes] = useState([]);
  const [editedEmployeeEndTimes, setEditedEmployeeEndTimes] = useState([]);
  const handleDeleteWorkButton = () => {
    setOpenDeleteDialog(true);
  };
  const [productLines, setProductLines] = useState([]);

  useEffect(() => {
    handleProductLine();
  }, []);

  useEffect(() => {
    fetchWorkInfo();
  }, [workNumber]);
  useEffect(() => {
    if (moNumber) {
      fetchEmployeeInfo();
    }
  }, [moNumber]);
  const handleWorkNumberEdit = (event) => {
    setEditingWorkNumber(event.target.value);
  };

  const handleProductionQuantityEdit = (event) => {
    setEditingProductionQuantity(event.target.value);
  };
  const handleDeleteConfirm = async () => {
    setOpenDeleteDialog(false);
    setSnackbarOpen(true);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lists/${workNumber}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSnackbarMessage("已刪除工單");
        setSnackbarStatus("success");
        setTimeout(() => {
          setLoading(false);

          navigate("/");
        }, 500);
      }
    } catch (error) {
      console.error("Error fetching work info:", error);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleStartTimeChange = (newStartTime, index) => {
    const updatedStartTimes = [...editedEmployeeStartTimes];
    updatedStartTimes[index] = newStartTime || "00:00";

    setEditedEmployeeStartTimes(updatedStartTimes);
  };

  const handleEndTimeChange = (newEndTime, index) => {
    const updatedEndTimes = [...editedEmployeeEndTimes];
    updatedEndTimes[index] = newEndTime || "00:00";

    setEditedEmployeeEndTimes(updatedEndTimes);
  };

  const handleSingleSubmit = async (employeeId, employeeName, status, startTime, endTime) => {
    setEditingEmployeeId(employeeId);

    setEmployeeId(employeeId);
    let sendMethod = null;
    if (status === "DELETE") {
      sendMethod = "DELETE";
      setOpenDeleteEmployeeDialog(true);
    } else {
      sendMethod = "PUT";
      const data = {
        employeeId: employeeId,
        employeeName: employeeName,
        startTime: startTime,
        endTime: endTime,
      };
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/employeeInfoMaintain/${employeeId}/${moNumber}/${workNumber}`, {
        method: sendMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // 将数据转换为 JSON 字符串
      });
      const responseData = await response.json();

      if (response.ok) {
        if (responseData.success === true) {
          setEmployeeInfo(responseData.employeeListsInfo);
          setSnackbarOpen(true);
          setSnackbarMessage(responseData.response);
          setSnackbarStatus("success");
        } else {
          setSnackbarOpen(true);
          setSnackbarMessage(responseData.response);
          setSnackbarStatus("error");
        }
      } else {
        setSnackbarOpen(true);
        setSnackbarMessage(responseData.response);
        setSnackbarStatus("error");
      }
    }
    if (!endTime) {
      const updatedEndTimes = [...editedEmployeeEndTimes];
      updatedEndTimes.push("00:00");
      setEditedEmployeeEndTimes(updatedEndTimes);
    }
    if (!startTime) {
      const updatedStartTimes = [...editedEmployeeStartTimes];
      updatedStartTimes.push("00:00");
      setEditedEmployeeStartTimes(updatedStartTimes);
    }
  };

  const handleProductLine = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/productLine`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setProductLines(responseData);
      }
    } catch (error) {
      console.error("Error fetching work info:", error);
    }
  };

  const handleDeleteEmployeeConfirmation = async (confirmed) => {
    if (confirmed) {
      // 執行刪除操作
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/employeeListSingle/${employeeId}/${moNumber}/${workNumber}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          if (responseData.success === true) {
            setEmployeeInfo(responseData.employeeListsInfo);
            setSnackbarOpen(true);
            setSnackbarMessage(responseData.response);
            setSnackbarStatus("success");
          } else {
            setSnackbarOpen(true);
            setSnackbarMessage(responseData.response);
            setSnackbarStatus("error");
          }
        }
        setEmployeeId("");
      } catch (error) {
        console.error("Error fetching employee info:", error);
      }
    }
    setOpenDeleteEmployeeDialog(false); // 關閉刪除確認對話框
  };
  const handleStartSubmit = async () => {
    setOpenDialog(true);
  };
  const handleCompleteSubmit = async () => {
    setCompleteWorkDialog(true);
  };
  const handleEmployeeSubmit = async () => {
    // 加入員工

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/employeeInfoMaintain/${employeeInput}/${moNumber}/${workNumber}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success === true) {
          setSnackbarOpen(true);
          setSnackbarMessage(responseData.response);
          setSnackbarStatus("success");
          setEmployeeInfo(responseData.employeeListData);
        } else {
          setSnackbarOpen(true);
          setSnackbarMessage(responseData.response);
          setSnackbarStatus("error");
        }
      }
    } catch (error) {
      console.error("Error fetching work info:", error);
    }
  };

  const fetchEmployeeInfo = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/employeeLists/${moNumber}/${workNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setEmployeeInfo(responseData.employeeListsInfo);

        setEmployeeDataLoaded(true); // 標記數據已加載完成
      }
    } catch (error) {
      console.error("Error fetching work info:", error);
    }
  };
  const fetchWorkInfo = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lists/${workNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setWorkInfo(responseData.listsInfo);
        setWorkDataLoaded(true); // 標記數據已加載完成
        if (responseData.listsInfo && responseData.listsInfo.moNumber) {
          setMoNumber(responseData.listsInfo.moNumber);
        }
      }
    } catch (error) {
      console.error("Error fetching work info:", error);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
        marginTop: "16px",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "20px", color: "#503C3C", fontWeight: "bold" }}>
        資料維護作業
      </Typography>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "60%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          zIndex: 9999, // 設定 zIndex 以確保 CircularProgress 顯示在最上層
          visibility: loading ? "visible" : "hidden", // 根據 loading 狀態調整顯示/隱藏
        }}
      >
        <CircularProgress />
      </Box>
      <Box
        sx={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          height: "77vh",
          width: "80%",
          alignItems: "center",
          position: "relative", // 设置相对定位
        }}
      >
        <Box
          sx={{
            height: "100%", // 設置固定高度
            overflowY: "hidden", // 設置垂直滾動
            width: "100%", // 確保寬度擴展至父元素的寬度
          }}
        >
          <StyledTableContainer component={Paper}>
            <StyledTable>
              <TableBody>
                {workDataLoaded && workInfo ? (
                  <>
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        sx={{ textAlign: "center", fontWeight: "bold", fontSize: "16px", borderRight: "1px solid #ccc", backgroundColor: "#BBAB8C" }}
                      >
                        報工號碼:{workNumber}
                      </TableCell>
                    </TableRow>
                    <TableCellWithText
                      leftTitle="製令單號"
                      leftValue={
                        <TextField
                          size="small" // 設置為小尺寸
                          value={editingWorkNumber !== "" ? editingWorkNumber : workInfo.moNumber}
                          onChange={handleWorkNumberEdit}
                        />
                      }
                      rightTitle="產品編號"
                      rightValue={workInfo.productNumber}
                    />
                    <TableCellWithText leftTitle="廠別" leftValue={workInfo.location} rightTitle="產品名稱" rightValue={workInfo.productName} />

                    <TableCellWithText
                      leftTitle="生產線代號"
                      leftValue={workInfo.productionLineCode}
                      rightTitle="生產線名稱"
                      rightValue={workInfo.productionLineName}
                    />
                    <TableCellWithText
                      leftTitle="產品規格"
                      leftValue={workInfo.productSpecification}
                      rightTitle="預計生產數量"
                      rightValue={
                        <TextField
                          size="small" // 設置為小尺寸
                          value={editingProductionQuantity !== "" ? editingProductionQuantity : workInfo.expectedProductionQuantity}
                          onChange={handleProductionQuantityEdit}
                        />
                      }
                    />
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} style={{ fontWeight: "bold", color: "#555", textAlign: "center" }}>
                      資料載入中...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </StyledTable>
            <Box
              sx={{
                position: "absolute",
                top: 20, // 调整图标的位置
                right: 20,
              }}
            >
              <Tooltip title="刪除工單">
                <Button
                  sx={{
                    minWidth: 0,
                    padding: 0,
                    borderRadius: "50%",
                    color: "#503C3C",
                  }}
                  onClick={handleDeleteWorkButton}
                >
                  <DeleteIcon />
                </Button>
              </Tooltip>
            </Box>
            <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
              <DialogTitle>刪除工單</DialogTitle>
              <DialogContent>確定要刪除此工單嗎？</DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteCancel} color="primary">
                  取消
                </Button>
                <Button onClick={handleDeleteConfirm} color="primary">
                  確定
                </Button>
              </DialogActions>
            </Dialog>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%", // Ensure the buttons span the entire width
              }}
            >
              <Box sx={{ maxWidth: "300px" }}>
                <TextField
                  label="請輸入員工工號或姓名"
                  variant="outlined"
                  value={employeeInput}
                  onChange={(e) => setEmployeeInput(e.target.value)}
                  fullWidth
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEmployeeSubmit}
                sx={{ "&:hover": { backgroundColor: "#B0A695" }, backgroundColor: "#3A3845", marginRight: "8px" }}
              >
                加入員工
              </Button>
            </Box>
            <StyledTable>
              <TableHead sx={{ backgroundColor: "#BBAB8C", position: "sticky", top: 0 }}>
                <TableRow>
                  <StyledTableCell>序號</StyledTableCell>
                  <StyledTableCell>員工工號</StyledTableCell>
                  <StyledTableCell>員工姓名</StyledTableCell>
                  <StyledTableCell>開工時間</StyledTableCell>
                  <StyledTableCell>完工時間</StyledTableCell>
                  <StyledTableCell>休息時間</StyledTableCell>
                  <StyledTableCell>總工時(HR)</StyledTableCell>
                  <StyledTableCell>操作</StyledTableCell>
                </TableRow>
              </TableHead>
            </StyledTable>
            <Box
              sx={{
                height: "450px", // 設置固定高度
                overflowY: "auto", // 設置垂直滾動
                width: "100%", // 確保寬度擴展至父元素的寬度
              }}
            >
              <StyledTable>
                <TableBody>
                  {employeeDataLoaded ? (
                    employeeInfo && employeeInfo.length > 0 ? (
                      employeeInfo.map((employee, index) => (
                        <TableRow
                          key={index}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E0E0E0")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                        >
                          <StyledMemberTableCell>{index + 1}</StyledMemberTableCell>
                          <StyledMemberTableCell>{employee.employeeId}</StyledMemberTableCell>
                          <StyledMemberTableCell>{employee.employeeName}</StyledMemberTableCell>
                          <StyledMemberTableCell>
                            <input
                              type="time"
                              value={editedEmployeeStartTimes[index] || (employee.startTime ? employee.startTime : "00:00")}
                              onChange={(e) => handleStartTimeChange(e.target.value, index)}
                            />
                          </StyledMemberTableCell>
                          <StyledMemberTableCell>
                            <input
                              type="time"
                              value={editedEmployeeEndTimes[index] || (employee.endTime ? employee.endTime : "00:00")}
                              onChange={(e) => handleEndTimeChange(e.target.value, index)}
                            />
                          </StyledMemberTableCell>

                          <StyledMemberTableCell>{employee.sleepTime}</StyledMemberTableCell>
                          <StyledMemberTableCell>{employee.totalTime}</StyledMemberTableCell>
                          <StyledMemberTableCell>
                            <Tooltip title="儲存">
                              <IconButton
                                onClick={() =>
                                  handleSingleSubmit(
                                    employee.employeeId,
                                    employee.employeeName,
                                    "COMPLETE",
                                    editedEmployeeStartTimes[index],
                                    editedEmployeeEndTimes[index]
                                  )
                                }
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="刪除員工">
                              <IconButton
                                onClick={() =>
                                  handleSingleSubmit(
                                    employee.employeeId,
                                    employee.employeeName,
                                    "DELETE",
                                    editedEmployeeStartTimes[index],
                                    editedEmployeeEndTimes[index]
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </StyledMemberTableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <StyledMemberTableCell colSpan={6} style={{ fontWeight: "bold", color: "#555", textAlign: "center" }}>
                          此工單暫無員工
                        </StyledMemberTableCell>
                      </TableRow>
                    )
                  ) : (
                    <TableRow>
                      <StyledMemberTableCell colSpan={6} style={{ fontWeight: "bold", color: "#555", textAlign: "center" }}>
                        資料載入中...
                      </StyledMemberTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </StyledTable>
            </Box>
          </StyledTableContainer>
        </Box>

        <Dialog open={openDeleteEmployeeDialog} onClose={() => setCompleteWorkDialog(false)}>
          <DialogTitle>刪除員工</DialogTitle>
          <DialogContent>
            <DialogContentText>確定要刪除此員工嗎？</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteEmployeeDialog(false)} color="primary">
              取消
            </Button>
            <Button onClick={() => handleDeleteEmployeeConfirmation(true)} color="primary" autoFocus>
              確定
            </Button>
          </DialogActions>
        </Dialog>

        <SnackbarAlert open={isSnackbarOpen} message={isSnackbarMessage} status={isSnackbarStatus} handleClose={() => setSnackbarOpen(false)} />
      </Box>
    </Box>
  );
};

export default EditWorkPage;
