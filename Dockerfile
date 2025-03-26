# 多阶段构建：构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
# 多架构构建支持
ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG TARGETARCH
RUN echo "Building for $TARGETARCH on $BUILDPLATFORM"
LABEL org.opencontainers.image.architecture=$TARGETARCH

# 配置nginx
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 环境变量
ENV ENV=production
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
