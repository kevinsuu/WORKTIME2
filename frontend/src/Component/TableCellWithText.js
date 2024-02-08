import React from "react";
import { TableRow, styled, TableCell } from "@mui/material";

// 定義 StyledTitleCell，套用顏色樣式到 title
const StyledTitleCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  borderRight: "1px solid #ccc",
}));

// 定義 StyledValueCell，維持白色背景
const StyledValueCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  borderRight: "1px solid #ccc",
}));

const TableCellWithText = ({ leftTitle, leftValue, rightTitle, rightValue }) => (
  <TableRow>
    <StyledTitleCell>{leftTitle}</StyledTitleCell>
    <StyledValueCell>{leftValue}</StyledValueCell>
    <StyledTitleCell>{rightTitle}</StyledTitleCell>
    <StyledValueCell>{rightValue}</StyledValueCell>
  </TableRow>
);

export default TableCellWithText;
