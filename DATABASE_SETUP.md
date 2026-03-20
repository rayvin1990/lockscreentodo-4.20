# 数据库连接问题解决方案

## 问题 1: 数据库认证失败

当前配置：

```
DATABASE_URL="postgresql://password:password@localhost:5432/saasfly"
```

如果这是你的配置，请确认：

1. PostgreSQL 是否在端口 5432 运行
2. 用户名是否为 `password`（这在生产环境中不太常见）
3. 密码是否为 `password`

## 解决方案

### 方案 A: 使用默认 PostgreSQL 配置（推荐）

如果你的 PostgreSQL 使用默认配置，更新 `.env.local`：

```bash
# 如果用户名是 postgres
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/saasfly"
POSTGRES_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/saasfly"

# 或者使用无密码连接（仅开发环境）
DATABASE_URL="postgresql://postgres@localhost:5432/saasfly"
POSTGRES_URL="postgresql://postgres@localhost:5432/saasfly"
```

### 方案 B: 使用 Docker PostgreSQL

如果还没有数据库，使用 Docker 快速启动：

```bash
docker run -d \
  --name saasfly-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=saasfly \
  -p 5432:5432 \
  postgres:16-alpine
```

然后更新 `.env.local`：

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saasfly"
POSTGRES_URL="postgresql://postgres:postgres@localhost:5432/saasfly"
```

### 方案 C: 使用 Vercel Postgres（推荐用于生产）

1. 在 Vercel 创建 PostgreSQL 数据库
2. 复制连接字符串
3. 更新 `.env.local`：

```
DATABASE_URL="你的连接字符串"
POSTGRES_URL="你的连接字符串"
```

## 方案 D: 跳过数据库迁移，先测试其他功能

如果你想先测试 AI 功能，可以：

1. 注释掉数据库相关代码
2. 使用内存存储或 mock 数据
3. 等数据库配置好后再迁移

## 测试数据库连接

使用以下命令测试连接：

```bash
# 测试 psql 连接
psql postgresql://password:password@localhost:5432/saasfly

# 或者使用 Node 测试
node -e "
const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://password:password@localhost:5432/saasfly'
});
client.connect()
  .then(() => console.log('✅ 连接成功'))
  .catch(err => console.error('❌ 连接失败:', err.message))
  .finally(() => client.end());
"
```

## 完成配置后

运行以下命令：

```bash
# 推送数据库 schema
bun db:push

# 生成 Prisma 客户端
bun db:generate

# 启动应用
bun run dev:web
```
