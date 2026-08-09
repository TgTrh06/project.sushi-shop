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
presentation/    # controller, route, validator
```

`backend/src/composition-root.ts` là nơi duy nhất khởi tạo dependency cụ thể. Các phần dùng chung như config, error mapping, database connection, security middleware và transaction abstraction nằm trong `backend/src/core`.

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

Backend chạy production bằng `dist/app.js`:

```bash
npm start
```

## Deploy Vercel

Nên tạo hai Vercel project từ cùng repository:

- Backend: Root Directory `backend`, entry `src/index.ts`, cấu hình environment backend và MongoDB Atlas.
- Frontend: Root Directory `frontend`, cấu hình `VITE_API_BASE_URL` nếu không dùng proxy. `frontend/vercel.json` đã có rewrite `/api/v1/*` tới backend; cập nhật domain đích theo URL backend thực tế.

Backend cần MongoDB Atlas replica set để sử dụng transaction và cần cấu hình `CORS_ORIGINS` bằng domain frontend production.

## API

Các endpoint public giữ prefix `/api/v1`. Reservation/payment mới dùng:

- `POST /api/v1/reservations`
- `GET /api/v1/reservations/:id/payment`
- `POST /api/v1/reservations/:id/confirm-payment`
- `POST /api/v1/reservations/:id/approve-payment` (admin)
- `POST /api/v1/reservations/:id/reject-payment` (admin)
- `GET/PUT /api/v1/admin/payment-settings` (admin)
