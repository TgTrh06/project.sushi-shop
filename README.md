# ITSU Sushi

Ứng dụng đặt bàn và quản lý nhà hàng sushi, gồm backend Express/MongoDB và frontend React. Backend và frontend sở hữu schema/type riêng theo module; không có package dùng chung ở root.

## Kiến trúc backend

Backend được tổ chức theo Modular Clean Architecture:

```text
Presentation → Application → Domain ← Infrastructure
```

Mỗi module nằm trong `backend/src/modules/<module>`:

```text
domain/          # entity, value type, port/interface; không biết Express/Mongoose
application/     # DTO và use case class; chỉ phụ thuộc domain
infrastructure/  # Mongoose repository, Cloudinary và adapter bên ngoài
presentation/http/ # controller, route, validator
```

`backend/src/bootstrap/composition-root.ts` là nơi duy nhất khởi tạo dependency cụ thể. Các phần dùng chung như config, error mapping, database connection, security middleware và transaction abstraction nằm trong `backend/src/core`.

Các module hiện có: `auth`, `users`, `products`, `categories`, `reservations`, `payments`, `reviews`, `uploads`, `stats`.

## Thanh toán VietQR thủ công

Admin cấu hình ngân hàng tại `/admin/payment-settings`. Luồng đặt bàn:

1. Khách tạo reservation; hệ thống tính deposit và giữ ghế tạm thời.
2. Khách chuyển khoản theo QR rồi bấm xác nhận đã thanh toán.
3. Reservation chuyển sang `PENDING_APPROVAL`; ghế vẫn bị khóa trong thời gian chờ duyệt.
4. Admin kiểm tra giao dịch và duyệt đúng số tiền; reservation chuyển sang `PAID`.
5. Từ chối hoặc hết hạn sẽ giải phóng seat hold.

VNPay đã được loại khỏi active backend surface. Các trường `vnp_TxnRef` cũ chỉ còn để migration/đọc tương thích dữ liệu cũ.

## Cài đặt và chạy local

Yêu cầu: Node.js 22+, MongoDB hỗ trợ transaction và tài khoản Cloudinary.

```bash
npm install
copy backend/.env.example backend/.env
npm run dev
```

Backend chạy tại `http://localhost:5000`, frontend tại `http://localhost:5173`.

`backend/.env` phải có các biến bắt buộc trong `.env.example`, đặc biệt `MONGO_URI`, hai JWT secret tối thiểu 32 ký tự và thông tin Cloudinary. Secret thật không được commit.

Tạo admin từ environment:

```bash
npm run seed:admin
```

Migration dữ liệu cũ:

```bash
npm run migrate:reservations --workspace=backend -- --dry-run
npm run migrate:reservations --workspace=backend
npm run migrate:seat-holds --workspace=backend -- --dry-run
```

## Build, lint và test

```bash
npm run build
npm run lint
npm test
```

Backend chạy production bằng `dist/bootstrap/app.js`:

```bash
npm start
```

## Deploy Railway + Vercel

Backend chạy trên Railway; frontend Vite chạy trên Vercel. Frontend gọi `/api/v1` cùng origin, rồi Vercel proxy request đến Railway. Nhờ vậy refresh cookie không trở thành cookie bên thứ ba.

### 1. Railway: backend

Tạo service từ repository này, giữ **Root Directory** ở repository root để npm workspaces hoạt động. Trong service settings, đặt:

- Build command: `npm ci && npm run build:backend`
- Start command: `npm run start`
- Healthcheck path: `/api/v1/health`

Khai báo các biến production dưới đây trong Railway (không commit giá trị thật):

```text
NODE_ENV=production
MONGO_URI=<MongoDB Atlas replica-set URI>
JWT_ACCESS_SECRET=<at least 32 characters>
JWT_REFRESH_SECRET=<at least 32 characters>
CLOUDINARY_CLOUD_NAME=<cloud name>
CLOUDINARY_API_KEY=<api key>
CLOUDINARY_API_SECRET=<api secret>
FRONTEND_URL=https://<your-vercel-domain>
CORS_ORIGINS=https://<your-vercel-domain>
ADMIN_EMAIL=<initial admin email>
ADMIN_USERNAME=<initial admin username>
ADMIN_PASSWORD=<initial admin password>
```

Railway cấp `PORT`; không khai báo biến này trên dashboard. Dùng MongoDB Atlas có replica set vì ứng dụng sử dụng transaction. Sau khi Railway cấp public domain, mở `https://<railway-domain>/api/v1/health`; response phải có `data.status` là `ok`.

### 2. Vercel: frontend

Tạo Vercel project từ cùng repository, chọn **Root Directory** là `frontend`. Vercel tự nhận Vite; dùng build command `npm run build` và output `dist`.

Trong [`frontend/vercel.json`](frontend/vercel.json), thay chính xác `REPLACE_WITH_YOUR_RAILWAY_DOMAIN` bằng host public Railway, **không** thêm `/` ở cuối. Ví dụ:

```json
"destination": "https://itsu-sushi-api.up.railway.app/api/v1/:path*"
```

Khai báo `VITE_CLOUDINARY_CLOUD_NAME` trên Vercel. Không đặt secrets Cloudinary hoặc JWT dưới tiền tố `VITE_`: mọi biến `VITE_*` sẽ được đưa vào JavaScript chạy trên trình duyệt.

Sau khi biết domain Vercel, quay lại Railway để cập nhật `FRONTEND_URL` và `CORS_ORIGINS`, rồi redeploy backend. Nếu cần test preview Vercel, thêm preview domain vào `CORS_ORIGINS` dưới dạng danh sách phân tách bằng dấu phẩy.

### 3. Kiểm tra sau deploy

1. Mở `/api/v1/health` trực tiếp trên Railway và qua domain Vercel.
2. Mở một URL SPA sâu, ví dụ `/menu`, rồi refresh trang để xác nhận rewrite về `index.html` hoạt động.
3. Đăng ký/đăng nhập, refresh trang, và xác nhận phiên được làm mới.
4. Kiểm tra upload Cloudinary, đặt bàn và trang quản trị.

Không chạy `seed:admin` nhiều lần nếu không cần; script không thay đổi tài khoản đã tồn tại.

## API

Các endpoint public giữ prefix `/api/v1`. Reservation/payment mới dùng:

- `POST /api/v1/reservations`
- `GET /api/v1/reservations/:id/payment`
- `POST /api/v1/reservations/:id/confirm-payment`
- `POST /api/v1/reservations/:id/approve-payment` (admin)
- `POST /api/v1/reservations/:id/reject-payment` (admin)
- `GET/PUT /api/v1/admin/payment-settings` (admin)
