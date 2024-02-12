// SetStartWork.js
import React, { useState, useEffect } from "react";
import "./fonts.css"; // Import the CSS file with font-face rule
import { useNavigate } from "react-router-dom"; // Import useNavigate

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
  Snackbar,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const StyledTableContainer = styled(TableContainer)({
  marginTop: 2,
});

const StyledTable = styled(Table)({
  minWidth: 650, // 调整表格的最小宽度
});

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold", // 调整表头单元格的字体粗细
});

const SetStartWork = () => {
  const [workOrders, setWorkOrders] = useState([]); // 新增状态来存储工单列表数据
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [isSnackbarStatus, setSnackbarStatus] = useState("success");
  const [isSnackbarMessage, setSnackbarMessage] = useState("success");
  const [loading, setLoading] = useState(false);

  const [shift, setShift] = useState(""); // 用於儲存選擇的班別

  const [StartWorkNumber, setStartWorkNumber] = useState("");
  useEffect(() => {
    // 在组件加载时发起 API 请求
    const fetchWorkOrders = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + "/api/orders");
        if (response.ok) {
          const data = await response.json();
          setWorkOrders(data.ordersInfo); // 更新工单列表数据
        } else {
          console.error("Error fetching work orders:", response.statusText);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };
    setShift("日班"); // 設定預設班別為 "日班"

    fetchWorkOrders();
  }, []);

  const handleWorkReportSubmit = async () => {
    try {
      setLoading(true);

      const requestData = {
        moNumber: StartWorkNumber,
        status: shift,
      };
      const response = await fetch(process.env.REACT_APP_API_BASE_URL + "/api/startWork", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData), // 将请求数据转换为 JSON 字符串
      });
      if (response.ok) {
        const responseData = await response.json();
        const workNumber = responseData.newListRecord.workNumber;

        setSnackbarStatus("success");
        setSnackbarMessage("報工成功");
        setSnackbarOpen(true);
        setTimeout(() => {
          setLoading(false);

          navigate(`/work/${workNumber}`);
        }, 1000);
      } else {
        setSnackbarStatus("error");
        setSnackbarMessage("製令單號錯誤");
        setSnackbarOpen(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const navigate = useNavigate();

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
      <Typography variant="h5" sx={{ marginBottom: "20px", color: "#503C3C", fontWeight: "bold" }}>
        開始報工
      </Typography>
      <Box
        sx={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box>
          <OutlinedInput
            placeholder="請輸入製令單號 e.g.20240120002test "
            value={StartWorkNumber}
            onChange={(e) => setStartWorkNumber(e.target.value)}
            sx={{
              marginBottom: "20px",
              width: "300px",

              backgroundColor: "white", // Set the background color to white for the input
            }}
          />
          <Select
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            displayEmpty
            sx={{
              marginBottom: "20px",
              width: "100px",
              backgroundColor: "white", // Set the background color to white for the input
            }}
          >
            <MenuItem value="日班">日班</MenuItem>
            <MenuItem value="加班">加班</MenuItem>
          </Select>

          <Button variant="contained" color="primary" onClick={handleWorkReportSubmit} sx={{ marginLeft: "20px", backgroundColor: "#503C3C" }}>
            送出
          </Button>
        </Box>

        <StyledTableContainer component={Paper}>
          <StyledTable>
            <TableHead>
              <StyledTableCell colSpan={12} align="center" style={{ backgroundColor: "#B19470", color: "#FFFFFF" }}>
                工單清單範例
              </StyledTableCell>
              <TableRow style={{ backgroundColor: "#BBAB8C" }}>
                <StyledTableCell>製令單號</StyledTableCell>
                <StyledTableCell>廠別</StyledTableCell>
                <StyledTableCell>生產線代號</StyledTableCell>
                <StyledTableCell>生產線名稱</StyledTableCell>
                <StyledTableCell>產品編號</StyledTableCell>
                <StyledTableCell>產品名稱</StyledTableCell>
                <StyledTableCell>產品規格</StyledTableCell>
                <StyledTableCell>預計生產數量</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workOrders.map((order) => (
                <TableRow key={order.moNumber}>
                  <StyledTableCell>{order.moNumber}</StyledTableCell>
                  <StyledTableCell>{order.location}</StyledTableCell>
                  <StyledTableCell>{order.productionLineCode}</StyledTableCell>
                  <StyledTableCell>{order.productionLineName}</StyledTableCell>
                  <StyledTableCell>{order.productNumber}</StyledTableCell>
                  <StyledTableCell>{order.productName}</StyledTableCell>
                  <StyledTableCell>{order.productSpecification}</StyledTableCell>
                  <StyledTableCell>{order.expectedProductionQuantity}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      </Box>
      <Snackbar open={isSnackbarOpen} autoHideDuration={1500} onClose={() => setSnackbarOpen(false)}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbarOpen(false)} severity={isSnackbarStatus}>
          {isSnackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default SetStartWork;
