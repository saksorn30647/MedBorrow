# MedBorrow Backend v2

## ขั้นตอนติดตั้ง (หลังมี Node.js + MySQL แล้ว)

### 1. เปิดโฟลเดอร์ใน VS Code
File → Open Folder → เลือกโฟลเดอร์ medborrow-backend

### 2. ติดตั้ง packages
เปิด Terminal (Ctrl+`) แล้วพิมพ์:
```
npm install
```

### 3. รัน SQL
เปิด sql/setup.sql → Ctrl+Shift+Enter

### 4. แก้ .env
ใส่รหัส MySQL ของคุณใน DB_PASSWORD

### 5. รัน Server
```
npm run dev
```

## Test Accounts
| Username | Password  | Role  |
|----------|-----------|-------|
| nurse01  | 1234      | staff |
| nurse02  | 1234      | staff |
| admin01  | admin123  | admin |

## API Endpoints
| Method | URL                        | Description       |
|--------|----------------------------|-------------------|
| POST   | /api/auth/login            | Login             |
| GET    | /api/equipment             | List equipment    |
| POST   | /api/requests              | Submit request    |
| GET    | /api/requests              | Get my requests   |
| PATCH  | /api/requests/:id/status   | Update status     |
