import React, { useState, useEffect, useMemo } from "react";
import "./fonts.css"; // Import the CSS file with font-face rule
import { useNavigate } from "react-router-dom"; // Import useNavigate
import RefreshIcon from "@mui/icons-material/Refresh"; // Import Refresh icon from MUI

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
  TableSortLabel,
  OutlinedInput,
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
  const [workOrders, setWorkOrders] = useState([]); // 新增狀態來存儲工單列表數據
  const [currentPage, setCurrentPage] = useState(1); // 用於跟蹤當前頁面
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // 新增排序配置狀態
  const itemsPerPage = 12; // Updated to display 13 items per page
  const totalItems = workOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [searchInput, setSearchInput] = useState(""); // 新增搜尋輸入狀態
  const [reset, setReset] = useState(false); // 新增重置狀態
  const navigate = useNavigate();

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

  const handleRowClick = (workNumber) => {
    navigate(`/work/${workNumber}`);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const requestSort = (key) => {
    let direction = "desc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    console.log(key, direction);
    setSortConfig({ key, direction });
  };
  const handleReset = async () => {
    setReset(false); // 点击重置按钮后，将重置状态设置为 false
    setSearchInput(""); // 清空搜索输入框内容
    const response = await fetch(process.env.REACT_APP_API_BASE_URL + `/api/lists`);

    if (response.ok) {
      const data = await response.json();
      setWorkOrders(data.listsInfo);
    } else {
      console.error("Error fetching work orders:", response.statusText);
    }
  };
  const handleWorkSearchSubmit = async () => {
    try {
      let response;
      if (searchInput === "") {
        response = await fetch(process.env.REACT_APP_API_BASE_URL + `/api/lists`);
      } else {
        response = await fetch(process.env.REACT_APP_API_BASE_URL + `/api/searchLists/${searchInput}`);
        setReset(true);
      }
      if (response.ok) {
        const data = await response.json();
        if (data.listsInfo) {
          setWorkOrders(data.listsInfo);
        } else {
          setWorkOrders([]);
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
    setCurrentPage(1);
  };

  const sortedWorkOrders = useMemo(() => {
    let sortedOrders = [...workOrders];
    if (sortConfig.key !== null) {
      sortedOrders.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedOrders;
  }, [workOrders, sortConfig]);
  const createSortHeader = (key, label) => (
    <StyledTableCell>
      <TableSortLabel
        active={sortConfig.key === key}
        direction={sortConfig.key === key ? sortConfig.direction : "asc"}
        onClick={() => requestSort(key)}
      >
        {label}
      </TableSortLabel>
    </StyledTableCell>
  );

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
      <Box>
        <OutlinedInput
          placeholder="請輸入搜尋資訊 e.g. 製令單號、報工號"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{
            width: "350px",
            backgroundColor: "white", // Set the background color to white for the input
          }}
        />
        <Button variant="contained" color="primary" onClick={handleWorkSearchSubmit} sx={{ marginLeft: "20px", backgroundColor: "#503C3C" }}>
          完成
        </Button>
        {reset && (
          <Button variant="outlined" onClick={handleReset} sx={{ marginLeft: "20px", backgroundColor: "#503C3C", color: "white" }}>
            <RefreshIcon />
          </Button>
        )}
      </Box>
      <Box
        sx={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          height: "77vh",
          alignItems: "center",
        }}
      >
        <StyledTableContainer component={Paper}>
          <StyledTable>
            <TableHead>
              <TableRow style={{ backgroundColor: "#BBAB8C" }}>
                {createSortHeader("workNumber", "報工號碼")}
                {createSortHeader("moNumber", "製令單號")}
                {createSortHeader("status", "報工狀態")}
                {createSortHeader("location", "廠別")}
                {createSortHeader("productionLineCode", "生產線代號")}
                {createSortHeader("productionLineName", "生產線名稱")}
                {createSortHeader("productNumber", "產品編號")}
                {createSortHeader("productName", "產品名稱")}
                {createSortHeader("productSpecification", "產品規格")}
                {createSortHeader("expectedProductionQuantity", "預計生產數量")}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedWorkOrders.slice(startIndex, endIndex).map((order) => (
                <TableRow key={order.workNumber} onClick={() => handleRowClick(order.workNumber)} style={{ cursor: "pointer" }}>
                  <StyledTableCell>{order.workNumber}</StyledTableCell>
                  <StyledTableCell>{order.moNumber}</StyledTableCell>
                  <StyledTableCell>{order.status}</StyledTableCell>
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
