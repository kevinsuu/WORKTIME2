// DataMaintain.js
import React, { useState, useEffect } from "react";
import "./fonts.css"; // Import the CSS file with font-face rule
import { useNavigate } from "react-router-dom"; // Import useNavigate
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid";

import SnackbarAlert from "../Component/SnackbarAlert";
import {
  styled,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow as MUITableRow, // Import MUITableRow alias
  TableCell,
  Paper,
  Pagination,
  TextField,
  MenuItem,
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
const DataMaintain = () => {
  const navigate = useNavigate();
  const handleRowClick = (workNumber) => {
    navigate(`/editWork/${workNumber}`);
  };
  const [workOrders, setWorkOrders] = useState([]); // 新增状态来存储工单列表数据
  const [currentPage, setCurrentPage] = useState(1); // 用於跟蹤當前頁面
  const itemsPerPage = 9;
  const [workNumber, setWorkNumber] = useState("");
  const [productLines, setProductLines] = useState([]);
  const [workInfo, setWorkInfo] = useState(null);
  const [selectedProductLine, setSelectedProductLine] = useState("");
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [isSnackbarMessage, setSnackbarMessage] = useState("");
  const [isSnackbarStatus, setSnackbarStatus] = useState("");
  const [completedQuantity, setCompletedQuantity] = useState("");

  useEffect(() => {
    handleProductLine();
  }, []);

  const handleSingleSubmit = async (workNumber, method) => {
    let sendMethod = null;
    if (method === "DELETE") {
      sendMethod = "DELETE";
    } else if (method === "EDIT") {
      sendMethod = "POST";
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
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + "/api/completeLists");
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
        資料維護作業
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box
            sx={{
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              height: "78vh",
              alignItems: "center",
            }}
          >
            <StyledTableContainer component={Paper}>
              <StyledTable>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#BBAB8C" }}>
                    <StyledTableCell>報工號碼</StyledTableCell>
                    <StyledTableCell>製令單號</StyledTableCell>
                    <StyledTableCell>報工狀態</StyledTableCell>
                    <StyledTableCell>廠別</StyledTableCell>
                    <StyledTableCell>生產線代號</StyledTableCell>
                    <StyledTableCell>生產線名稱</StyledTableCell>
                    <StyledTableCell>產品編號</StyledTableCell>
                    <StyledTableCell>產品名稱</StyledTableCell>
                    <StyledTableCell>產品規格</StyledTableCell>
                    <StyledTableCell>預計生產數量</StyledTableCell>
                    <StyledTableCell>操作</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workOrders.slice(startIndex, endIndex).map((order) => (
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
                      <StyledTableCell onClick={(e) => e.stopPropagation()}>
                        <Tooltip title="刪除">
                          <IconButton
                            sx={{ "& svg": { fontSize: "24px" } }} // 设置图标大小为 1rem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSingleSubmit(order.workNumber, "DELETE");
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </StyledTable>
            </StyledTableContainer>
          </Box>
        </Grid>
      </Grid>

      <SnackbarAlert open={isSnackbarOpen} message={isSnackbarMessage} status={isSnackbarStatus} handleClose={() => setSnackbarOpen(false)} />

      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          justifyContent: "center",
          marginBottom: "4px", // 與底部的距離
        }}
      >
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" size="large" />
      </Box>
    </Box>
  );
};

export default DataMaintain;
