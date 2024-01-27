// CompleteWork.js
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
  Pagination,
} from "@mui/material";
const StyledTableContainer = styled(TableContainer)({
  marginTop: 2,
});

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
  const [StartWorkTime, CompleteWorkTime] = useState("");
  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + "/api/lists");
        if (response.ok) {
          const data = await response.json();
          console.log(data.listsInfo);
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

  const handleWorkReportSubmit = async () => {
    try {
      const requestData = {
        time: StartWorkTime,
      };
      const response = await fetch(process.env.REACT_APP_API_BASE_URL + "/api/work", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData), // 将请求数据转换为 JSON 字符串
      });
      if (response.ok) {
        // 跳轉化面
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
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
          placeholder="請輸入工單號"
          value={StartWorkTime}
          onChange={(e) => CompleteWorkTime(e.target.value)}
          sx={{
            width: "300px",
            backgroundColor: "white", // Set the background color to white for the input
          }}
        />
        <Button variant="contained" color="primary" onClick={handleWorkReportSubmit} sx={{ marginLeft: "20px", backgroundColor: "#503C3C" }}>
          完成
        </Button>
      </Box>
      <Box
        sx={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          height: "71vh",

          alignItems: "center",
        }}
      >
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
      </Box>
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          justifyContent: "center",
          marginBottom: "12px", // 與底部的距離
        }}
      >
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" size="large" />
      </Box>
    </Box>
  );
};

export default CompleteWork;
