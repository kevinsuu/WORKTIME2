// WorkPage.js
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./fonts.css"; // Import the CSS file with font-face rule
import { useNavigate } from "react-router-dom"; // Import useNavigate
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import SnackbarAlert from "../Component/SnackbarAlert";
import TableCellWithText from "../Component/TableCellWithText";

import { styled, Box, Typography, Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from "@mui/material";
const StyledTableContainer = styled(TableContainer)({
  marginTop: 2,
});

const StyledTable = styled(Table)({
  minWidth: 650, // 调整表格的最小宽度
});
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  borderTop: "1px solid #ccc", // Corrected border-right to borderRight
}));
const WorkPage = () => {
  const navigate = useNavigate();
  const { workNumber } = useParams();
  const [workInfo, setWorkInfo] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [isSnackbarMessage, setSnackbarMessage] = useState("");
  const [isSnackbarStatus, setSnackbarStatus] = useState("");

  const handleDeleteWorkButton = () => {
    setOpenDeleteDialog(true);
  };
  useEffect(() => {
    fetchWorkInfo();
  }, []);

  const handleDeleteConfirm = async () => {
    setOpenDeleteDialog(false);
    setSnackbarOpen(true);

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
  const handleWorkReportSubmit = async () => {
    // 完工工單
    console.log(123);
  };
  const fetchEmployeeInfo = async (moNumber) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api//employeeLists/${moNumber}/${workNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.employeeListsInfo);
        console.log(123);
        setEmployeeInfo(responseData.employeeListsInfo);
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
        if (responseData.listsInfo && responseData.listsInfo.moNumber) {
          fetchEmployeeInfo(responseData.listsInfo.moNumber);
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
        報工頁面
      </Typography>
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
        <StyledTableContainer component={Paper}>
          <StyledTable>
            <TableBody>
              {workInfo && (
                <>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      sx={{ textAlign: "center", fontWeight: "bold", fontSize: "16px", borderRight: "1px solid #ccc", backgroundColor: "#BBAB8C" }}
                    >
                      報工號碼:{workNumber}
                    </TableCell>
                  </TableRow>
                  <TableCellWithText leftTitle="製令單號" leftValue={workInfo.moNumber} rightTitle="產品編號" rightValue={workInfo.productNumber} />
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
                    rightValue={workInfo.expectedProductionQuantity}
                  />
                </>
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
              justifyContent: "space-between", // Add this to position the buttons at each end
              width: "100%", // Ensure the buttons span the entire width
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleWorkReportSubmit}
              sx={{ "&:hover": { backgroundColor: "#B0A695" }, backgroundColor: "#3A3845", marginRight: "8px" }}
            >
              員工設定
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleWorkReportSubmit}
              sx={{ "&:hover": { backgroundColor: "#B0A695" }, backgroundColor: "#42855B" }}
            >
              完成工單
            </Button>
          </Box>
          <StyledTable>
            <TableHead sx={{ backgroundColor: "#BBAB8C" }}>
              <TableRow>
                <StyledTableCell>序號</StyledTableCell>
                <StyledTableCell>員工姓名</StyledTableCell>
                <StyledTableCell>開工時間</StyledTableCell>
                <StyledTableCell>完工時間</StyledTableCell>
                <StyledTableCell>休息時間</StyledTableCell>
                <StyledTableCell>總工時(HR)</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeInfo && employeeInfo.length > 0 ? (
                employeeInfo.map((employee, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{employee.employeeName}</TableCell>
                    <TableCell>{employee.startTime}</TableCell>
                    <TableCell>{employee.endTime}</TableCell>
                    <TableCell>{employee.sleepTime}</TableCell>
                    <TableCell>{employee.totalTime}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} style={{ fontWeight: "bold", color: "#555", textAlign: "center" }}>
                    此工單暫無員工
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>

        <SnackbarAlert open={isSnackbarOpen} message={isSnackbarMessage} status={isSnackbarStatus} handleClose={() => setSnackbarOpen(false)} />
      </Box>
    </Box>
  );
};

export default WorkPage;
