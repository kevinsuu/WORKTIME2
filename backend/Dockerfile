# 使用 Node 镜像作为基础镜像
FROM node:14

# 设置工作目录
WORKDIR /app

# 將 package.json 和 package-lock.json 複製到容器中
COPY package*.json ./

# 安裝應用程式的相依套件
RUN npm install

# 複製應用程式代碼到容器中
COPY . .

# 建置應用程式（如果需要）
# RUN npm run build

# 暴露應用程式使用的端口（假設是 3000）
EXPOSE 3001
RUN pwd
RUN cd backend
RUN ls -al /app

# 啟動應用程式
CMD ["node", "app.js"]
