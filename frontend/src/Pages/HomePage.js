import React, { useState, useEffect } from "react";
import "./fonts.css"; // Import the CSS file with font-face rule
import { useNavigate } from "react-router-dom"; // Import useNavigate

import {
  styled,
  Box,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow as MUITableRow, // Import MUITableRow alias
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
const TableRow = styled(MUITableRow)({
  "&:hover": {
    backgroundColor: "#e8f0fe", // Adjust this color as needed
  },
});

const HomePage = () => {
  const [workOrders, setWorkOrders] = useState([]); // 新增状态来存储工单列表数据
  const [currentPage, setCurrentPage] = useState(1); // 用於跟蹤當前頁面
  const itemsPerPage = 12; // Updated to display 13 items per page
  const navigate = useNavigate();

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

  const handleRowClick = (workNumber) => {
    navigate(`/work/${workNumber}`);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const totalItems = workOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

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
        首頁
      </Typography>
      <Box
        sx={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          height: "77vh",
          width: "80%",
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
              </TableRow>
            </TableHead>
            <TableBody>
              {workOrders.slice(startIndex, endIndex).map((order) => (
                <TableRow key={order.workNumber} onClick={() => handleRowClick(order.workNumber)} style={{ cursor: "pointer" }}>
                  <StyledTableCell>{order.workNumber}</StyledTableCell>

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

export default HomePage;
