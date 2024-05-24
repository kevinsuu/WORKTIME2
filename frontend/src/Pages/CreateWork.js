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
import Grid from "@mui/material/Grid";

const StyledTableContainer = styled(TableContainer)({
  marginTop: 2,
});

const StyledTable = styled(Table)({
  minWidth: 650, // 调整表格的最小宽度
});

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold", // 调整表头单元格的字体粗细
});

const CreateWork = () => {
  const [workOrders, setWorkOrders] = useState([]); // 新增状态来存储工单列表数据
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [isSnackbarStatus, setSnackbarStatus] = useState("success");
  const [isSnackbarMessage, setSnackbarMessage] = useState("success");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    StartWorkNumber: "",
    factory: "",
    productionLineId: "",
    productionLineName: "",
    productNumber: "",
    productName: "",
    productSpecification: "",
    expectedProductionQuantity: "",
  });

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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
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
  const inputFields = [
    { name: "StartWorkNumber", placeholder: "請輸入製令單號" },
    { name: "factory", placeholder: "請輸入廠別" },
    { name: "productionLineId", placeholder: "請輸入生產線代號" },
    { name: "productionLineName", placeholder: "請輸入生產線名稱" },
    { name: "productNumber", placeholder: "請輸入產品編號" },
    { name: "productName", placeholder: "請輸入產品名稱" },
    { name: "productSpecification", placeholder: "請輸入產品規格" },
    { name: "expectedProductionQuantity", placeholder: "請輸入預計生產數量" },
  ];
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
      <Typography variant="h5" sx={{ marginBottom: "12px", color: "#503C3C", fontWeight: "bold" }}>
        新建製令單作業
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "row", marginBottom: "12px" }}>
        {inputFields.slice(0, 2).map((field, index) => (
          <OutlinedInput
            key={index}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            sx={{ marginRight: "4px", width: "300px", backgroundColor: "white" }}
          />
        ))}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", marginBottom: "12px" }}>
        {inputFields.slice(2, 4).map((field, index) => (
          <OutlinedInput
            key={index}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            sx={{ marginRight: "4px", width: "300px", backgroundColor: "white" }}
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", marginBottom: "12px" }}>
        {inputFields.slice(4, 6).map((field, index) => (
          <OutlinedInput
            key={index}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            sx={{ marginRight: "4px", width: "300px", backgroundColor: "white" }}
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", marginBottom: "12px" }}>
        {inputFields.slice(6, 8).map((field, index) => (
          <OutlinedInput
            key={index}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            sx={{ marginRight: "4px", width: "300px", backgroundColor: "white" }}
          />
        ))}
      </Box>
      <Button variant="contained" color="primary" onClick={handleWorkReportSubmit} sx={{ marginLeft: "20px", backgroundColor: "#503C3C" }}>
        建立
      </Button>
      <Grid container spacing={2} sx={{ width: "80%", alignItems: "center", flexDirection: "column", padding: "12px", display: "flex" }}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
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
        </Grid>
      </Grid>
      <Snackbar open={isSnackbarOpen} autoHideDuration={1500} onClose={() => setSnackbarOpen(false)}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbarOpen(false)} severity={isSnackbarStatus}>
          {isSnackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default CreateWork;
