# 🍣 Sushi Shop - Hệ Thống Đặt Bàn & Bán Hàng Sushi

Ứng dụng quản lý nhà hàng sushi hiện đại với tính năng đặt bàn trực tuyến, quản lý menu, thanh toán, và hệ thống quản trị toàn diện.

---

## 📋 Mục Đích

Nền tảng quản lý toàn bộ hoạt động nhà hàng sushi từ khách hàng đến quản trị viên:
- 👥 **Khách hàng**: Xem menu, đặt bàn, thanh toán trực tuyến
- 🍽️ **Nhà hàng**: Quản lý sản phẩm, đơn hàng, đặt chỗ
- 📊 **Quản trị**: Thống kê, báo cáo, quản lý người dùng

---

## 🛠️ Công Nghệ

### Backend
- **Framework**: Express.js 5 + TypeScript
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **File Upload**: Cloudinary
- **Payment**: VNPay
- **Logging**: Winston

### Frontend
- **Framework**: React 19 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Forms**: React Hook Form
- **API**: Axios
- **Routing**: React Router v7
- **Charts**: Recharts

### Shared
- **Validation**: Zod schemas

---

## 📁 Cấu Trúc Dự Án

```
project.sushi-shop/
├── backend/              # Server Express + MongoDB
│   ├── src/
│   │   ├── modules/      # Auth, Categories, Products, Reservations, Reviews, Users
│   │   ├── middleware/   # Authentication, validation, error handling
│   │   ├── config/       # Database, Cloudinary, Payment
│   │   └── container/    # Dependency injection
│   └── package.json
│
├── frontend/             # React UI
│   ├── src/
│   │   ├── features/     # Admin, Auth, Categories, Products, etc.
│   │   ├── components/   # Reusable UI components
│   │   ├── stores/       # Zustand state management
│   │   └── pages/        # Route pages
│   └── package.json
│
└── shared/               # Shared schemas & types
    ├── src/schemas/      # Zod validation schemas
    └── package.json
```

---

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu
- Node.js 18+
- MongoDB (local hoặc cloud)
- Cloudinary account (cho upload ảnh)
- VNPay account (cho thanh toán)

### 1. Clone & Cài Đặt

```bash
cd project.sushi-shop

# Cài dependencies cho tất cả packages
npm install

# Hoặc cài từng phần
cd backend && npm install
cd ../frontend && npm install
cd ../shared && npm install
```

### 2. Cấu Hình Environment

**Backend** - `backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sushi-shop
JWT_SECRET=your-secret-key
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
VNPAY_TMNCODE=your-tmncode
VNPAY_HASHSECRET=your-hash-secret
NODE_ENV=development
```

**Frontend** - `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
```

### 3. Chạy Dự Án

**Terminal - Chạy tại Root dự án**:
```bash
npm run dev
# Server chạy tại http://localhost:5000
# Client chạy tại http://localhost:5173
```

---

## 📱 Tính Năng Chính

### 👤 Khách Hàng
- ✅ Xem menu và chi tiết sản phẩm
- ✅ Đặt bàn theo ngày/giờ
- ✅ Thanh toán VNPay
- ✅ Viết review, đánh giá sản phẩm
- ✅ Lịch sử đơn hàng

### 🏪 Nhà Hàng
- ✅ Quản lý danh mục sản phẩm
- ✅ Quản lý đặt chỗ
- ✅ Xem đơn hàng
- ✅ Upload ảnh sản phẩm

### 📊 Quản Trị
- ✅ Thống kê doanh thu, khách
- ✅ Quản lý người dùng
- ✅ Quản lý tất cả sản phẩm
- ✅ Xem báo cáo chi tiết

---

## 🔐 Authentication

Dự án sử dụng JWT với Flow:
1. Đăng ký/Đăng nhập → Nhận JWT token
2. Token lưu trong cookie (httpOnly)
3. Gửi kèm request API tới server
4. Server xác thực và trả về dữ liệu

---

## 📚 API Chính

| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/products` | Danh sách sản phẩm |
| POST | `/api/reservations` | Tạo đặt chỗ |
| GET | `/api/users/:id` | Thông tin người dùng |
| GET | `/api/stats` | Thống kê (admin) |

---

## 🛠️ Build & Deploy

### Build
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### Production
```bash
# Backend
cd backend && npm start

# Frontend
# Phục vụ file từ folder `dist/`
```

---

## 📝 Linting & Format

```bash
# Kiểm tra linting
cd frontend && npm run lint

# Build
npm run build
```

---

## 📞 Hỗ Trợ

Cần giúp đỡ? Kiểm tra:
- 🔍 Xem logs trong `backend/logs/`
- 🗂️ Tìm hiểu struct trong thư mục modules
- 🛠️ Đảm bảo `.env` cấu hình đúng

---

**Made with ❤️ for Sushi Lovers**