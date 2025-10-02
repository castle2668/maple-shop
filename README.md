# 📦 Monorepo 開發指南

## 專案結構
```
/apps
  /frontend   # Next.js 前端
  /backend    # Nest.js 後端 (Prisma + SQLite)
/packages
  /shared     # 共用型別/工具 (可選)
```

## 前置需求
- Node.js (建議 v18+)
- pnpm (建議 v9+)
- SQLite (內建，不需額外安裝)

## 安裝依賴
在 root 跑一次即可：
```bash
pnpm install
```

## 啟動開發模式
前端：
```bash
pnpm --filter frontend dev
```

後端：
```bash
pnpm --filter backend start:dev
```

---

## Prisma 工作流程

### 修改 schema
如果有修改 `schema.prisma`（例如新增欄位 `description`, `stock`）：

1. 建立 migration（會同步更新資料庫 + 生成 Prisma Client）
   ```bash
   pnpm --filter backend exec npx prisma migrate dev --name <migration_name>
   ```

2. 或者單純重新生成 Prisma Client（不改 DB 結構時）
   ```bash
   pnpm --filter backend exec npx prisma generate
   ```

### 檢查資料庫內容
使用 Prisma Studio GUI：
```bash
pnpm --filter backend exec npx prisma studio
```

---

## 常見問題

### Q: 修改 schema 後 API 型別沒更新？
👉 記得跑：
```bash
pnpm --filter backend exec npx prisma migrate dev --name update_schema
```

### Q: 只改 TS 介面，沒有改 DB，要跑什麼？
👉 只需要：
```bash
pnpm --filter backend exec npx prisma generate
```

### Q: 看到 `Ignored build scripts: @prisma/client, prisma...` 警告？
👉 執行：
```bash
pnpm approve-builds
```
並允許 Prisma 相關套件執行 build script。
