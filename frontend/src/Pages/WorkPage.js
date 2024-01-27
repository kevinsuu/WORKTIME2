// WorkPage.js
import React from "react";
import { useParams } from "react-router-dom";

const WorkPage = () => {
  // 使用 useParams hook 獲取動態參數
  const { workNumber } = useParams();

  return (
    <div>
      <h1>工單頁面</h1>
      <p>工單號: {workNumber}</p>
      {/* 其他工單頁面內容 */}
    </div>
  );
};

export default WorkPage;
