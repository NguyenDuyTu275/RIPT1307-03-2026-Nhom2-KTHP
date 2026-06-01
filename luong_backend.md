# Giải thích Backend - WebBookingCuoiKy

## 1. Kiến trúc tổng quan

```mermaid
graph TB
    Client["Frontend React"] -->|HTTP Request| Controller
    Controller -->|Gọi| Service
    Service -->|Gọi| Repository
    Repository -->|SQL| DB["Supabase PostgreSQL"]
    
    Client -->|Bearer Token| JwtFilter
    JwtFilter -->|Xác thực| SecurityConfig
    SecurityConfig -->|Cho phép/Chặn| Controller

    Service -->|Gửi mail| MailService
    Service -->|Tạo thông báo| NotificationService
```

### Phân lớp (Layer)

| Lớp | Thư mục | Vai trò |
|-----|---------|---------|
| **Controller** | `controller/` | Nhận request từ frontend, trả response |
| **Service** | `service/` | Xử lý logic nghiệp vụ |
| **Repository** | `repository/` | Truy vấn database (JPA) |
| **Entity** | `entity/` | Ánh xạ bảng trong database |
| **DTO** | `dto/` | Dữ liệu frontend gửi lên (request body) |
| **Security** | `security/` | JWT token, xác thực, phân quyền |
| **Config** | `config/` | Cấu hình Security, CORS, Swagger |

---

## 2. Luồng đăng ký (Register + OTP)

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant Auth as AuthController
    participant US as UserService
    participant OTP as OtpService
    participant Mail as MailService
    participant DB as Database

    FE->>Auth: POST /auth/register {username, password, email}
    Auth->>US: sendOtp(request)
    US->>DB: Kiểm tra username đã tồn tại?
    alt Username trùng
        US-->>FE: ❌ 400 "Username already exists"
    end
    US->>OTP: generateOtp(email) → "123456"
    US->>US: Lưu request vào pendingUsers (memory)
    US->>Mail: Gửi mail OTP đến email
    US-->>FE: ✅ "OTP sent to email"

    FE->>Auth: POST /auth/verify-otp {email, otp}
    Auth->>US: verifyOtp(email, otp)
    US->>OTP: So sánh OTP
    alt OTP sai
        US-->>FE: ❌ 400 "OTP invalid"
    end
    US->>DB: Lưu User mới (password đã mã hóa BCrypt)
    US-->>FE: ✅ "Register success"
```

> [!IMPORTANT]
> **`pendingUsers`** và **`otpStorage`** đều lưu trong **bộ nhớ RAM** (HashMap). Nếu server restart giữa chừng → mất hết OTP và thông tin đăng ký đang chờ.

---

## 3. Luồng đăng nhập (Login + JWT)

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant Auth as AuthController
    participant US as UserService
    participant JWT as JwtUtil
    participant DB as Database

    FE->>Auth: POST /auth/login {username, password}
    Auth->>US: login(request)
    US->>DB: Tìm user theo username
    US->>US: So sánh password (BCrypt hoặc plain text)
    US->>JWT: generateToken(username, role)
    JWT-->>US: "eyJhbGciOi..."
    US-->>FE: ✅ Trả JWT token
    Note over FE: Frontend lưu token vào localStorage
```

**Sau khi login**, mọi request tiếp theo frontend gửi kèm header:
```
Authorization: Bearer eyJhbGciOi...
```

---

## 4. Luồng xác thực JWT (mọi request)

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant Filter as JwtFilter
    participant JWT as JwtUtil
    participant Security as SecurityConfig
    participant Controller

    FE->>Filter: Request + Header "Authorization: Bearer xxx"
    Filter->>JWT: extractUsername(token) + extractRole(token)
    JWT-->>Filter: username="Duytu1", role="USER"
    Filter->>Filter: Tạo Authentication(username, ROLE_USER)
    Filter->>Security: Kiểm tra quyền truy cập URL
    
    alt Có quyền
        Security->>Controller: Cho phép
    else Không có quyền
        Security-->>FE: ❌ 403 Forbidden
    end
```

### Bảng phân quyền URL

| URL Pattern | Quyền |
|-------------|-------|
| `/auth/**` | ✅ Ai cũng truy cập được (không cần token) |
| `/swagger-ui/**`, `/v3/api-docs/**` | ✅ Public |
| `/uploads/**` | ✅ Public (ảnh tĩnh) |
| `GET /hotels/**`, `GET /rooms/**` | ✅ Public |
| `POST/PUT/DELETE /hotels/**` | 🔒 Cần đăng nhập (bất kỳ user) |
| `/admin/**` | 🔴 Chỉ ADMIN |
| `/users/**` | 🔴 Chỉ ADMIN |
| `/bookings/**` | 🔒 Cần đăng nhập |
| `/notifications/**` | 🔒 Cần đăng nhập |
| `/api/images/**` | 🔒 Cần đăng nhập |
| `/api/reviews/**` | 🔒 Cần đăng nhập |

> [!WARNING]
> `POST/PUT/DELETE /hotels/**` hiện tại **bất kỳ user đăng nhập** đều gọi được (không chỉ ADMIN). Nếu muốn chỉ ADMIN mới CRUD hotel, cần thêm rule trong SecurityConfig.

---

## 5. Luồng đặt phòng (Booking)

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant BC as BookingController
    participant BS as BookingService
    participant DB as Database
    participant Noti as NotificationService

    FE->>BC: POST /bookings/{hotelId} + JWT
    Note over FE: Body: {checkInDate, checkOutDate, rooms: [{roomId, quantity}]}
    
    BC->>BS: createBooking(username, hotelId, request)
    BS->>BS: ① Validate ngày (checkIn < checkOut, không quá khứ)
    BS->>BS: ② Validate rooms không rỗng
    BS->>DB: Tìm User, Hotel
    
    loop Mỗi room trong request
        BS->>DB: Tìm Room theo roomId
        BS->>BS: ③ Kiểm tra room thuộc hotel
        BS->>DB: Tính số phòng đã đặt (trùng ngày)
        BS->>BS: ④ Kiểm tra còn phòng trống
        BS->>DB: Lưu BookingRoom
    end
    
    BS->>BS: Tính totalPrice = Σ(giá × số_lượng × số_đêm)
    BS->>DB: Lưu Booking (status=PENDING, payment=UNPAID)
    BS->>Noti: Thông báo cho tất cả ADMIN
    BS-->>FE: ✅ Booking object
```

### Công thức tính giá
```
totalPrice = Σ (pricePerNight × quantity × số_đêm)
số_đêm = checkOutDate - checkInDate (tính theo ngày)
```

### Kiểm tra phòng trống
```
available = room.quantity - SUM(đã đặt trong khoảng ngày trùng)
```
Chỉ tính các booking có status **PENDING** hoặc **CONFIRMED** (bỏ qua CANCELLED, REJECTED).

---

## 6. Luồng Admin duyệt/từ chối booking

```mermaid
sequenceDiagram
    participant Admin as Admin Frontend
    participant AC as AdminController
    participant BS as BookingService
    participant Noti as NotificationService
    participant DB as Database

    Admin->>AC: PUT /admin/bookings/{id}/approve
    AC->>BS: approveBooking(id)
    BS->>DB: Tìm booking (phải PENDING)
    BS->>BS: Kiểm tra lại phòng trống
    BS->>DB: Cập nhật status = CONFIRMED
    BS->>Noti: Gửi thông báo cho user
    BS-->>Admin: ✅ Booking đã duyệt

    Admin->>AC: PUT /admin/bookings/{id}/reject
    AC->>BS: rejectBooking(id, response)
    BS->>DB: Cập nhật status = REJECTED
    BS->>Noti: Gửi thông báo cho user

    Admin->>AC: PUT /admin/bookings/{id}/paid
    AC->>BS: markBookingPaid(id)
    BS->>DB: Cập nhật paymentStatus = PAID (chỉ khi CONFIRMED)
    BS->>Noti: Gửi thông báo cho user
```

### Vòng đời Booking

```mermaid
stateDiagram-v2
    [*] --> PENDING: User đặt phòng
    PENDING --> CONFIRMED: Admin duyệt
    PENDING --> REJECTED: Admin từ chối
    PENDING --> CANCELLED: User hủy
    CONFIRMED --> CANCELLED: User hủy
    
    state CONFIRMED {
        UNPAID --> PAID: Admin xác nhận thanh toán
    }
```

---

## 7. Luồng yêu cầu hủy/đổi ngày (BookingRequest)

```mermaid
sequenceDiagram
    participant User as User
    participant BC as BookingController
    participant BS as BookingService
    participant Admin as AdminController
    participant DB as Database

    User->>BC: POST /bookings/{bookingId}/requests
    Note over User: Body: {type: "CANCEL" hoặc "CHANGE_DATE", reason, newCheckIn, newCheckOut}
    BC->>BS: createBookingRequest(username, bookingId, dto)
    BS->>DB: Lưu BookingRequest (status=PENDING)
    BS->>BS: Thông báo cho ADMIN

    Admin->>Admin: GET /admin/booking-requests
    Admin->>Admin: PUT /admin/booking-requests/{id}/approve
    Note over Admin: Nếu CANCEL → booking.status = CANCELLED
    Note over Admin: Nếu CHANGE_DATE → cập nhật ngày + tính lại giá
```

### 2 loại request

| Type | Khi approve |
|------|------------|
| `CANCEL` | Booking chuyển sang `CANCELLED` |
| `CHANGE_DATE` | Cập nhật checkIn/checkOut mới + tính lại totalPrice |

---

## 8. Luồng upload ảnh

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant IC as ImageController
    participant FS as File System

    FE->>IC: POST /api/images/hotel/{hotelId} (multipart file)
    IC->>FS: Lưu file vào uploads/hotels/{uuid}.jpg
    IC->>IC: Cập nhật hotel.imageUrl = "/uploads/hotels/{uuid}.jpg"

    FE->>IC: POST /api/images/room/{roomId} (multipart file)
    IC->>FS: Lưu file vào uploads/rooms/{uuid}.jpg
    IC->>IC: Thêm RoomImage vào room.images
```

Ảnh được serve qua [WebConfig.java](file:///d:/WebBookingCuoiKy/src/main/java/com/Nhom2/booking/config/WebConfig.java): URL `/uploads/**` → thư mục `./uploads/` trên server.

---

## 9. Thông báo (Notification)

- Mỗi hành động quan trọng tạo **Notification** lưu vào DB
- User xem: `GET /notifications/my`
- Đánh dấu đã đọc: `PUT /notifications/{id}/read`

| Sự kiện | Ai nhận thông báo |
|---------|-------------------|
| User đặt phòng | Tất cả ADMIN |
| User hủy booking | Tất cả ADMIN |
| User gửi request (hủy/đổi ngày) | Tất cả ADMIN |
| Admin duyệt/từ chối booking | User sở hữu booking |
| Admin xác nhận thanh toán | User sở hữu booking |
| Admin duyệt/từ chối request | User sở hữu booking |

---

## 10. Admin Dashboard & Báo cáo

### Thống kê (`GET /admin/statistics/overview`)
Trả về JSON chứa:
- Tổng users, admins, hotels, rooms
- Số booking theo từng status (pending, confirmed, rejected, cancelled)
- Số request đang chờ
- Tổng doanh thu (booking đã PAID)

### Xuất Excel (`GET /admin/reports/bookings.xlsx`)
Xuất file Excel chứa tất cả booking, dùng thư viện **Apache POI**.

---

## ⚠️ Các lưu ý quan trọng

### 1. OTP & pendingUsers lưu trong RAM
```java
private final Map<String, String> otpStorage = new HashMap<>();       // OtpService
private final Map<String, RegisterRequest> pendingUsers = new HashMap<>();  // UserService
```
- **Restart server = mất hết** OTP và request đăng ký đang chờ
- OTP **không hết hạn** — ai biết OTP thì dùng bất kỳ lúc nào
- Dự án cuối kỳ thì OK, production cần lưu vào Redis/DB + thêm TTL

### 2. Gửi mail mỗi lần login
```java
// UserService.login() - line 126-130
mailService.sendMail(user.getEmail(), "Đăng nhập thành công", ...);
```
User login nhiều lần sẽ bị **spam mail**. Cân nhắc bỏ nếu không cần.

### 3. POST/PUT/DELETE Hotel không chỉ ADMIN
Hiện tại bất kỳ user đăng nhập đều có thể tạo/sửa/xóa hotel. Nếu muốn chỉ ADMIN:
```java
// SecurityConfig.java - thêm dòng này trước .anyRequest()
.requestMatchers(HttpMethod.POST, "/hotels/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.PUT, "/hotels/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.DELETE, "/hotels/**").hasRole("ADMIN")
```

### 4. Credentials hard-coded
Database password, JWT secret, Gmail password đều nằm trực tiếp trong source code. Dự án cuối kỳ thì chấp nhận được, nhưng **đừng push lên GitHub public**.

### 5. Entity `BookingRequest` trùng tên DTO
Cả `entity/BookingRequest.java` và `dto/BookingRequest.java` đều tên `BookingRequest` → trong code phải dùng full path `com.Nhom2.booking.entity.BookingRequest` để phân biệt. Không gây lỗi nhưng hơi rối.
