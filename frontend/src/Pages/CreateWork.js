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
const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: "white",
  "& .MuiSelect-select": {
    color: "#503C3C", // 確保字體顏色與 OutlinedInput 一致
  },
}));

const CreateWork = () => {
  const [workOrders, setWorkOrders] = useState([]); // 新增状态来存储工单列表数据
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [isSnackbarStatus, setSnackbarStatus] = useState("success");
  const [isSnackbarMessage, setSnackbarMessage] = useState("success");
  const [loading, setLoading] = useState(false);
  // TODO 需要再做一隻取得 productionLine 的 API

  const productionLines = [
    { id: 1, productionLineName: "生產一線", productionLineCode: "PRODUCT_LINE_1" },
    { id: 2, productionLineName: "生產二線", productionLineCode: "PRODUCT_LINE_2" },
    { id: 3, productionLineName: "生產三線", productionLineCode: "PRODUCT_LINE_3" },
    { id: 4, productionLineName: "生產四線", productionLineCode: "PRODUCT_LINE_4" },
    { id: 5, productionLineName: "生產五線", productionLineCode: "PRODUCT_LINE_5" },
    { id: 6, productionLineName: "生產六線", productionLineCode: "PRODUCT_LINE_6" },
  ];
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
  const [selectedLine, setSelectedLine] = useState(""); // 用于存储选中的生产线

  const [StartWorkNumber, setStartWorkNumber] = useState("");
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
  useEffect(() => {
    // 在组件加载时发起 API 请求

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
      if (isNaN(formData.expectedProductionQuantity)) {
        setSnackbarStatus("error");
        setSnackbarMessage("預計生產數量請輸入數字!!");
        setSnackbarOpen(true);
        setLoading(false);
      }
      const selectedProductionLine = productionLines.find((line) => line.id === selectedLine);

      const requestData = {
        moNumber: formData.StartWorkNumber,
        location: formData.factory,
        productNumber: formData.productNumber,
        productName: formData.productName,
        productSpecification: formData.productSpecification,
        expectedProductionQuantity: formData.expectedProductionQuantity,
        productionInfo: selectedProductionLine,
      };

      const response = await fetch(process.env.REACT_APP_API_BASE_URL + "/api/createWork", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData), // 将请求数据转换为 JSON 字符串
      });
      console.log(response);
      if (response.ok) {
        setSnackbarStatus("success");
        setSnackbarMessage("新建成功!!");
        setSnackbarOpen(true);
        setTimeout(() => {
          setLoading(false);

          fetchWorkOrders();
        }, 1000);
      } else {
        setSnackbarStatus("error");
        setSnackbarMessage("新建失敗");
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
        <StyledSelect
          value={selectedLine}
          onChange={(e) => setSelectedLine(e.target.value)}
          displayEmpty
          sx={{ marginRight: "4px", backgroundColor: "white", width: "300px", color: "#503C3C" }}
        >
          <MenuItem value="" disabled>
            請選擇生產線
          </MenuItem>
          {productionLines.map((line) => (
            <MenuItem key={line.id} value={line.id}>
              {line.productionLineName}
            </MenuItem>
          ))}
        </StyledSelect>
        <Button
          variant="contained"
          color="primary"
          onClick={handleWorkReportSubmit}
          sx={{ marginRight: "4px", backgroundColor: "#503C3C", width: "300px" }}
        >
          建立
        </Button>
      </Box>

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
