// CompleteWork.js
import React, { useState, useEffect } from "react";
import "./fonts.css"; // Import the CSS file with font-face rule
import { useNavigate } from "react-router-dom"; // Import useNavigate
import TextField from "@mui/material/TextField";
import SnackbarAlert from "../Component/SnackbarAlert";
import Grid from "@mui/material/Grid";

import {
  styled,
  Box,
  Typography,
  Button,
  OutlinedInput,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Pagination,
} from "@mui/material";
import {
  FormControl,
  MenuItem,
  Select,
  CircularProgress,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const StyledTableContainer = styled(TableContainer)({});

const StyledTable = styled(Table)({
  minWidth: 650, // 调整表格的最小宽度
});

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold", // 调整表头单元格的字体粗细
});

const CompleteWork = () => {
  const [workOrders, setWorkOrders] = useState([]); // 新增状态来存储工单列表数据
  const [currentPage, setCurrentPage] = useState(1); // 用於跟蹤當前頁面
  const itemsPerPage = 11;
  const [openCompleteWorkDialog, setCompleteWorkDialog] = useState(false);
  const [selectedProductLine, setSelectedProductLine] = useState("");
  const [completeWorkTime, setCompleteWorkTime] = useState("");
  const [workNumber, setWorkNumber] = useState("");
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [isSnackbarMessage, setSnackbarMessage] = useState("");
  const [isSnackbarStatus, setSnackbarStatus] = useState("");
  const [productLines, setProductLines] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [completedQuantity, setCompletedQuantity] = useState("");
  const [workInfo, setWorkInfo] = useState(null);

  useEffect(() => {
    handleProductLine();
  }, []);
  const handleCompleteCheckSubmit = async () => {
    // 完工工單確認
    if (completeWorkTime == "") {
      setSnackbarOpen(true);
      setSnackbarMessage("沒有輸入工號");
      setSnackbarStatus("error");
      setCompleteWorkDialog(false);
    } else {
      try {
        const requestBody = {
          remark: remarks,
          completedQuantity: completedQuantity,
          status: "完成",
        };
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lists/${workNumber}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        const responseData = await response.json();
        if (response.ok) {
          setCompleteWorkDialog(false);
          setSnackbarOpen(true);
          setSnackbarMessage("工單已完成");
          setSnackbarStatus("success");
          setTimeout(() => {
            navigate("/");
          }, 500);
        } else {
          setSnackbarOpen(true);
          setSnackbarMessage(responseData.response);
          setSnackbarStatus("error");
        }
      } catch (error) {
        console.error("Error fetching work info:", error);
      }
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
  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + "/api/lists");
        if (response.ok) {
          const data = await response.json();
          setWorkOrders(data.listsInfo); // 更新工单列表数据
        } else {
          console.error("Error fetching work orders:", response.statusText);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchWorkOrders();
  }, []);
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
        const productionLineId = responseData.listsInfo[0].productionLineId;
        setSelectedProductLine(productionLineId);
      }
    } catch (error) {
      console.error("Error fetching work info:", error);
    }
  };
  const handleWorkReportSubmit = async () => {
    setWorkNumber(completeWorkTime);
    await fetchWorkInfo();
    setCompleteWorkDialog(true);
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const totalItems = workOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
        marginTop: "16px", // 添加這一行以設置頂部邊距
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "20px", color: "#503C3C", fontWeight: "bold" }}>
        完成報工
      </Typography>
      <Box>
        <OutlinedInput
          placeholder="請輸入報工號碼"
          value={completeWorkTime}
          onChange={(e) => setCompleteWorkTime(e.target.value)}
          sx={{
            width: "300px",
            backgroundColor: "white", // Set the background color to white for the input
          }}
        />
        <Button variant="contained" color="primary" onClick={handleWorkReportSubmit} sx={{ marginLeft: "20px", backgroundColor: "#503C3C" }}>
          完成
        </Button>
      </Box>
      <Grid container spacing={2} sx={{ height: "75vh", alignItems: "center", flexDirection: "column", padding: "12px", display: "flex" }}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <StyledTableContainer component={Paper} className="table-container">
            <StyledTableContainer component={Paper}>
              <StyledTable>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#BBAB8C" }}>
                    <StyledTableCell>報工號碼</StyledTableCell>
                    <StyledTableCell>製令單號</StyledTableCell>
                    <StyledTableCell>廠別</StyledTableCell>
                    <StyledTableCell>生產線代號</StyledTableCell>
                    <StyledTableCell>生產線名稱</StyledTableCell>
                    <StyledTableCell>產品編號</StyledTableCell>
                    <StyledTableCell>產品名稱</StyledTableCell>
                    <StyledTableCell>產品規格</StyledTableCell>
                    <StyledTableCell>預計生產數量</StyledTableCell>
                    <StyledTableCell>報工型態</StyledTableCell>
                    <StyledTableCell>完成數量</StyledTableCell>
                    <StyledTableCell>備註</StyledTableCell>
                    <StyledTableCell>總工時</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workOrders.slice(startIndex, endIndex).map((order) => (
                    <TableRow key={order.workNumber}>
                      <StyledTableCell>{order.workNumber}</StyledTableCell>
                      <StyledTableCell>{order.moNumber}</StyledTableCell>
                      <StyledTableCell>{order.location}</StyledTableCell>
                      <StyledTableCell>{order.productionLineCode}</StyledTableCell>
                      <StyledTableCell>{order.productionLineName}</StyledTableCell>
                      <StyledTableCell>{order.productNumber}</StyledTableCell>
                      <StyledTableCell>{order.productName}</StyledTableCell>
                      <StyledTableCell>{order.productSpecification}</StyledTableCell>
                      <StyledTableCell>{order.expectedProductionQuantity}</StyledTableCell>
                      <StyledTableCell>{order.status}</StyledTableCell>
                      <StyledTableCell>{order.completedQuantity}</StyledTableCell>
                      <StyledTableCell>{order.remark}</StyledTableCell>
                      <StyledTableCell>{order.productionHours}</StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </StyledTable>
            </StyledTableContainer>
          </StyledTableContainer>
        </Grid>
      </Grid>

      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          justifyContent: "center",
          marginBottom: "12px", // 與底部的距離
        }}
      >
        <Dialog open={openCompleteWorkDialog} onClose={() => setCompleteWorkDialog(false)}>
          <DialogTitle>完成工單資訊</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ marginTop: "8px", fontWeight: "bold" }}></DialogContentText>

            <FormControl fullWidth variant="outlined" sx={{ marginTop: "8px" }}>
              <InputLabel id="product-line-label">生產線</InputLabel>
              <Select
                labelId="product-line-label"
                value={selectedProductLine}
                onChange={(e) => setSelectedProductLine(e.target.value)}
                label="生產線"
              >
                {productLines.map((productLine) => (
                  <MenuItem key={productLine.id} value={productLine.id}>
                    {productLine.productionLineName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="完成數量"
              sx={{ marginTop: "8px" }}
              variant="outlined"
              value={completedQuantity}
              onChange={(e) => setCompletedQuantity(e.target.value)}
              fullWidth
            />
            <TextField
              label="備註"
              sx={{ marginTop: "8px" }}
              variant="outlined"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCompleteWorkDialog(false)} color="primary">
              取消
            </Button>
            <Button
              onClick={() => {
                // 在這裡執行確認操作
                handleCompleteCheckSubmit();
              }}
              color="primary"
              autoFocus
            >
              確定
            </Button>
          </DialogActions>
        </Dialog>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" size="large" />
        <SnackbarAlert open={isSnackbarOpen} message={isSnackbarMessage} status={isSnackbarStatus} handleClose={() => setSnackbarOpen(false)} />
      </Box>
    </Box>
  );
};

export default CompleteWork;
