# 使用 Node 镜像作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 將 package.json 和 package-lock.json 複製到容器中
COPY package*.json ./

# RUN npm install --force
RUN npm install

# COPY ./src ./src
# COPY ./public ./public

COPY ./build ./build

# RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "3000"]