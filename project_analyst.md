# 📋 WebBookingCuoiKy — Phân Tích Dự Án Toàn Diện

---

## 1. Tổng Quan Kiến Trúc

**Tech Stack**: Spring Boot (Java 17) + React (TypeScript/Vite) + PostgreSQL (Supabase)

```mermaid
graph LR
    A["React Frontend<br/>(Vite + TypeScript)"] -->|HTTP + JWT| B["Spring Boot Backend<br/>(REST API)"]
    B --> C["PostgreSQL<br/>(Supabase)"]
    B --> D["OpenAI API<br/>(GPT-3.5-turbo)"]
    B --> E["SMTP Email<br/>(OTP + Notifications)"]
    A -->|localStorage| F["Client Storage<br/>(Wishlist, Avatar, Token)"]
```

**Luồng chính**: Frontend React → HTTP Request + JWT Bearer Token → JwtFilter xác thực → SecurityConfig phân quyền → Controller → Service → Repository → PostgreSQL

---

## 2. Cấu Trúc Dự Án (Directory Tree)

```
WebBookingCuoiKy/
├── pom.xml                          # Maven dependencies
├── SQL.sql                          # Database schema
│
├── src/main/java/com/Nhom2/booking/
│   ├── BackendcuoikyApplication.java   # Spring Boot entry point
│   │
│   ├── config/
│   │   ├── SecurityConfig.java         # JWT + Role-based security
│   │   ├── SwaggerConfig.java          # Swagger/OpenAPI docs
│   │   └── WebConfig.java              # Static resource + CORS
│   │
│   ├── security/
│   │   ├── JwtUtil.java                # JWT token generation/validation
│   │   └── JwtFilter.java             # Request filter for JWT auth
│   │
│   ├── entity/                        # JPA Entities (DB tables)
│   │   ├── User.java                  # Users (USER/ADMIN roles)
│   │   ├── Hotel.java                 # Hotels
│   │   ├── Room.java                  # Rooms (belongs to Hotel)
│   │   ├── RoomImage.java             # Room photos
│   │   ├── Booking.java               # Bookings
│   │   ├── BookingRoom.java           # Booking ↔ Room (junction)
│   │   ├── BookingRequest.java        # Cancel/Change requests
│   │   ├── Review.java                # Hotel reviews
│   │   ├── Notification.java          # In-app notifications
│   │   └── AppConfig.java             # Key-value config (API keys)
│   │
│   ├── enums/
│   │   ├── BookingStatus.java         # PENDING/CONFIRMED/REJECTED/CANCELLED
│   │   ├── PaymentStatus.java         # UNPAID/PAID
│   │   ├── RequestStatus.java         # PENDING/APPROVED/REJECTED
│   │   ├── RequestType.java           # CANCEL/CHANGE_DATE
│   │   └── UserRole.java              # USER/ADMIN
│   │
│   ├── repository/                    # Spring Data JPA repositories
│   │   ├── UserRepository.java
│   │   ├── HotelRepository.java
│   │   ├── RoomRepository.java
│   │   ├── BookingRepository.java
│   │   ├── BookingRoomRepository.java
│   │   ├── BookingRequestRepository.java
│   │   ├── ReviewRepository.java
│   │   ├── NotificationRepository.java
│   │   └── AppConfigRepository.java
│   │
│   ├── dto/                           # Data Transfer Objects
│   │
│   ├── service/
│   │   ├── UserService.java           # User CRUD + auth logic
│   │   ├── HotelService.java          # Hotel search/filter
│   │   ├── RoomService.java           # Room management
│   │   ├── BookingService.java        # Booking lifecycle (18KB!)
│   │   ├── PaymentService.java        # VietQR generation
│   │   ├── ReviewService.java         # Review CRUD
│   │   ├── NotificationService.java   # In-app notifications
│   │   ├── MailService.java           # Email sending
│   │   ├── OtpService.java            # OTP generation
│   │   ├── ReportService.java         # Excel export
│   │   └── StatisticsService.java     # Dashboard metrics
│   │
│   └── controller/
│       ├── AuthController.java        # Login/Register/OTP
│       ├── HotelController.java       # Hotel CRUD
│       ├── RoomController.java        # Room CRUD
│       ├── BookingController.java     # Booking operations
│       ├── PaymentController.java     # QR payment
│       ├── AdminController.java       # Admin dashboard
│       ├── UserController.java        # User management
│       ├── ReviewController.java      # Reviews
│       ├── ImageController.java       # Image upload
│       ├── NotificationController.java# Notifications
│       ├── ChatController.java        # AI Chatbot (OpenAI proxy)
│       └── GlobalExceptionHandler.java# Error handling
│
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   │
│   └── src/
│       ├── App.tsx                    # Routing (React Router)
│       ├── App.css
│       ├── api.ts                     # API client (Swagger + fetch)
│       ├── index.css                  # Global styles (40KB!)
│       │
│       ├── components/
│       │   ├── Header.tsx             # Navigation bar
│       │   └── AIAssistantWidget.tsx   # Floating AI chatbot
│       │
│       ├── context/
│       │   └── WishlistContext.tsx     # Wishlist state (localStorage)
│       │
│       └── pages/
│           ├── HomePage.tsx           # Landing page + search
│           ├── LoginPage.tsx          # Login form
│           ├── SearchResults.tsx      # Search + filters + map
│           ├── HotelDetailPage.tsx    # Hotel detail (30KB!)
│           ├── HotelReviewAndChatPage.tsx # Reviews + chat (17KB)
│           └── Wishlist.tsx           # Saved hotels
```

---

## 3. Entity Relationships (ERD)

```mermaid
erDiagram
    USER ||--o{ BOOKING : creates
    USER ||--o{ REVIEW : writes
    USER ||--o{ NOTIFICATION : receives
    HOTEL ||--o{ ROOM : has
    HOTEL ||--o{ BOOKING : "booked at"
    HOTEL ||--o{ REVIEW : "reviewed on"
    ROOM ||--o{ ROOM_IMAGE : has
    ROOM ||--o{ BOOKING_ROOM : "booked via"
    BOOKING ||--o{ BOOKING_ROOM : contains
    BOOKING ||--o{ BOOKING_REQUEST : "has requests"
    USER ||--o{ BOOKING_REQUEST : "processed by (admin)"

    USER {
        Long id PK
        String username UK
        String password
        String email
        UserRole role
    }
    HOTEL {
        Long id PK
        String name
        String address
        String city
        String description
        String imageUrl
        Double ratingAvg
        String status
    }
    ROOM {
        Long id PK
        String name
        String type
        Double pricePerNight
        Int capacity
        Int quantity
    }
    BOOKING {
        Long id PK
        Date checkInDate
        Date checkOutDate
        Double totalPrice
        BookingStatus status
        PaymentStatus paymentStatus
    }
    REVIEW {
        Long id PK
        Int rating
        String comment
    }
```

---

## 4. Tất Cả API Endpoints

### 🔓 Public (Không cần đăng nhập)

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/auth/register` | Đăng ký → gửi OTP email |
| POST | `/auth/verify-otp` | Xác thực OTP → tạo tài khoản |
| POST | `/auth/login` | Đăng nhập → trả JWT token |
| GET | `/hotels` | Danh sách khách sạn |
| GET | `/hotels/{id}` | Chi tiết khách sạn |
| POST | `/api/chat` | AI Chatbot (OpenAI proxy) |

### 🔐 Authenticated (Cần đăng nhập)

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/bookings/{hotelId}` | Đặt phòng |
| GET | `/bookings/my` | Lịch sử đặt phòng |
| PUT | `/bookings/cancel/{id}` | Hủy đặt phòng |
| POST | `/bookings/{id}/requests` | Gửi yêu cầu thay đổi/hủy |
| GET | `/bookings/{id}/payment-qr` | Tạo QR thanh toán VietQR |
| POST | `/bookings/{id}/confirm-payment` | Xác nhận đã chuyển khoản |
| GET | `/api/reviews` | Danh sách đánh giá |
| POST | `/api/reviews` | Viết đánh giá |
| POST | `/api/images/hotel/{id}` | Upload ảnh khách sạn |
| POST | `/api/images/room/{id}` | Upload ảnh phòng |
| GET | `/notifications/my` | Thông báo của tôi |
| PUT | `/notifications/{id}/read` | Đánh dấu đã đọc |

### 🛡️ Admin Only

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/admin/bookings` | Tất cả booking (filter status) |
| PUT | `/admin/bookings/{id}/approve` | Duyệt booking |
| PUT | `/admin/bookings/{id}/reject` | Từ chối booking |
| PUT | `/admin/bookings/{id}/paid` | Xác nhận đã thanh toán |
| GET | `/admin/booking-requests` | Danh sách yêu cầu |
| PUT | `/admin/booking-requests/{id}/approve` | Duyệt yêu cầu |
| PUT | `/admin/booking-requests/{id}/reject` | Từ chối yêu cầu |
| GET | `/admin/statistics/overview` | Thống kê dashboard |
| GET | `/admin/reports/bookings.xlsx` | Xuất báo cáo Excel |
| GET/POST/PUT/DELETE | `/users/**` | Quản lý users |

---

## 5. Luồng Hoạt Động Các Chức Năng (Use Cases)

### 🔑 UC1: Đăng Ký & Đăng Nhập

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Backend
    participant Mail as Email Service
    participant DB as Database

    Note over User,DB: === ĐĂNG KÝ ===
    User->>FE: Nhập username, email, password
    FE->>BE: POST /auth/register
    BE->>Mail: Gửi OTP qua email
    BE-->>FE: "OTP đã gửi"
    User->>FE: Nhập mã OTP
    FE->>BE: POST /auth/verify-otp
    BE->>DB: Tạo User (BCrypt hash password)
    BE-->>FE: "Đăng ký thành công"

    Note over User,DB: === ĐĂNG NHẬP ===
    User->>FE: Nhập username + password
    FE->>BE: POST /auth/login
    BE->>DB: Verify credentials
    BE-->>FE: JWT Token (chứa username + role)
    FE->>FE: Lưu token vào localStorage
```

### 🔍 UC2: Tìm Kiếm & Xem Khách Sạn

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Backend

    User->>FE: Nhập city, ngày, số khách
    FE->>BE: GET /hotels?city=...
    BE-->>FE: Danh sách hotels
    FE->>FE: Filter client-side (giá, rating, loại, tiện nghi)
    User->>FE: Click hotel card
    FE->>BE: GET /hotels/{id}
    FE->>BE: GET /rooms/hotel/{id}
    BE-->>FE: Hotel detail + rooms
    FE->>FE: Hiển thị gallery, rooms, map, reviews
```

### 📅 UC3: Đặt Phòng (Booking Lifecycle)

```mermaid
stateDiagram-v2
    [*] --> PENDING: User đặt phòng
    PENDING --> CONFIRMED: Admin duyệt
    PENDING --> REJECTED: Admin từ chối
    PENDING --> CANCELLED: User hủy

    CONFIRMED --> CANCELLED: User hủy
    CONFIRMED --> PAID: Admin xác nhận thanh toán

    state CONFIRMED {
        [*] --> UNPAID
        UNPAID --> QR_Generated: User tạo QR
        QR_Generated --> Payment_Confirmed: User xác nhận chuyển khoản
        Payment_Confirmed --> PAID: Admin verify
    }
```

```mermaid
sequenceDiagram
    actor User
    actor Admin
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    User->>FE: Chọn phòng + ngày + số lượng
    FE->>BE: POST /bookings/{hotelId}
    BE->>DB: Check availability (overlapping bookings)
    BE->>DB: Tạo Booking (PENDING, UNPAID)
    BE->>DB: Tạo Notification cho Admin
    BE-->>FE: Booking created

    Admin->>BE: PUT /admin/bookings/{id}/approve
    BE->>DB: Status → CONFIRMED
    BE->>DB: Tạo Notification cho User

    User->>FE: Xem booking → Tạo QR
    FE->>BE: GET /bookings/{id}/payment-qr
    BE-->>FE: VietQR image (TPBank)
    User->>FE: Đã chuyển khoản → Xác nhận
    FE->>BE: POST /bookings/{id}/confirm-payment
    BE->>DB: Tạo Notification cho Admin

    Admin->>BE: PUT /admin/bookings/{id}/paid
    BE->>DB: PaymentStatus → PAID
    BE->>DB: Tạo Notification cho User
```

### ⭐ UC4: Đánh Giá Khách Sạn

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Backend

    User->>FE: Vào trang hotel detail
    User->>FE: Chấm điểm (1-10) + viết comment
    FE->>BE: POST /api/reviews
    BE->>BE: Check 1 review/user/hotel
    BE-->>FE: Review created
    FE->>FE: Cập nhật danh sách reviews
```

### 💬 UC5: AI Chatbot (Hiện tại)

```mermaid
sequenceDiagram
    actor User
    participant Widget as AIAssistantWidget
    participant API as api.ts
    participant BE as ChatController
    participant OpenAI as OpenAI API

    User->>Widget: Click floating button
    Widget->>Widget: Mở cửa sổ chat
    User->>Widget: Nhập câu hỏi hoặc click quick question
    Widget->>API: chatApi.sendMessage(messages, hotelInfo)
    API->>BE: POST /api/chat {messages, hotelInfo}
    BE->>BE: Đọc OPENAI_API_KEY từ DB
    BE->>BE: Tạo system prompt với hotel context
    BE->>OpenAI: POST /v1/chat/completions (gpt-3.5-turbo)
    OpenAI-->>BE: AI response
    BE-->>API: {reply: "..."}
    API-->>Widget: Hiển thị reply
```

---

## 6. 🤖 Đánh Giá Chatbot Hiện Tại vs. Tiêu Chuẩn Cao Cấp

### Hiện tại có gì?

Dự án có **2 chatbot AI riêng biệt** (cùng dùng 1 backend):

| Tiêu chí | AIAssistantWidget (HomePage) | Chat trong ReviewPage |
|----------|------|------|
| Vị trí | Floating widget, chỉ ở HomePage | Embedded panel, trang review |
| Hotel context | ❌ Hardcoded thông tin chung | ✅ Dùng data hotel thật |
| Quick questions | 8 nút, tự động gửi | 5 nút, chỉ fill input |
| Typing indicator | ✅ Có animation | ⚠️ Animation có thể lỗi |
| Auto-scroll | ✅ Có | ❌ Không |
| Timestamps | ❌ Không | ✅ Có |
| Reset chat | ✅ Có | ❌ Không |
| Markdown render | ❌ Không | ❌ Không |
| Lưu lịch sử | ❌ Mất khi refresh | ❌ Mất khi refresh |

### So sánh với chatbot cao cấp (Booking.com, Agoda, Traveloka...)

| Tính năng | Cao cấp | Dự án hiện tại | Trạng thái |
|-----------|---------|----------------|------------|
| AI trả lời thông minh | ✅ | ✅ GPT-3.5 | ✅ OK |
| Floating widget toàn trang | ✅ | ⚠️ Chỉ HomePage | ❌ Thiếu |
| Context-aware (biết hotel đang xem) | ✅ | ⚠️ Chỉ 1/2 chat | ⚠️ Partial |
| Lưu lịch sử chat | ✅ | ❌ | ❌ Thiếu |
| Markdown / Rich text | ✅ | ❌ Plain text | ❌ Thiếu |
| **Chat real-time User ↔ Admin** | ✅ | ❌ Không có | ❌ **Thiếu** |
| Typing indicator | ✅ | ✅ | ✅ OK |
| Notification khi có tin nhắn | ✅ | ❌ | ❌ Thiếu |
| Avatar + tên người gửi | ✅ | ❌ | ❌ Thiếu |
| Gửi hình ảnh trong chat | ✅ | ❌ | ❌ Thiếu |
| Trạng thái online/offline | ✅ | ❌ | ❌ Thiếu |
| Rate limiting / chống spam | ✅ | ❌ | ❌ Thiếu |

> [!WARNING]
> **Kết luận**: Chatbot hiện tại chỉ là **AI proxy đơn giản** (gọi OpenAI rồi trả kết quả). Chưa có chức năng **chat real-time giữa User và Admin** — đây là tính năng quan trọng nhất còn thiếu.

---

## 7. 🔴 Chat Real-time User ↔ Admin — Giải Thích Luồng

### Công nghệ cần dùng: WebSocket + STOMP + SockJS

```mermaid
graph TB
    subgraph "Frontend (React)"
        U["User Browser"]
        A["Admin Browser"]
    end

    subgraph "Backend (Spring Boot)"
        WS["WebSocket Server<br/>(STOMP over SockJS)"]
        MB["Message Broker<br/>(/topic, /queue)"]
        CC["ChatController<br/>(@MessageMapping)"]
        CS["ChatService"]
    end

    subgraph "Database"
        DB["PostgreSQL"]
        CM["chat_messages table"]
        CR["chat_rooms table"]
    end

    U <-->|"WebSocket<br/>ws://localhost:8080/ws"| WS
    A <-->|"WebSocket<br/>ws://localhost:8080/ws"| WS
    WS --> MB
    MB --> CC
    CC --> CS
    CS --> DB
    DB --> CM
    DB --> CR
```

### Luồng chi tiết — User gửi tin nhắn cho Admin

```mermaid
sequenceDiagram
    actor User
    participant FE_User as "User Frontend<br/>(SockJS Client)"
    participant WS as "WebSocket Server<br/>(Spring STOMP)"
    participant Service as ChatService
    participant DB as Database
    participant FE_Admin as "Admin Frontend<br/>(SockJS Client)"
    actor Admin

    Note over User,Admin: === KẾT NỐI ===
    User->>FE_User: Mở trang web
    FE_User->>WS: Connect WebSocket (ws:// + JWT token)
    WS->>WS: Xác thực JWT → lấy userId
    FE_User->>WS: SUBSCRIBE /user/queue/messages
    FE_Admin->>WS: SUBSCRIBE /topic/admin/messages

    Note over User,Admin: === GỬI TIN NHẮN ===
    User->>FE_User: Gõ "Tôi muốn hỏi về phòng"
    FE_User->>WS: SEND /app/chat.send {content, roomId}
    WS->>Service: handleMessage()
    Service->>DB: Lưu ChatMessage (sender=USER)
    Service->>DB: Cập nhật ChatRoom.lastMessage
    WS->>FE_Admin: SEND /topic/admin/messages (tin nhắn mới!)
    WS->>FE_User: SEND /user/queue/messages (echo xác nhận)
    FE_Admin->>Admin: 🔔 Notification: "Tin nhắn mới từ User"

    Note over User,Admin: === ADMIN TRẢ LỜI ===
    Admin->>FE_Admin: Gõ "Chào bạn, phòng còn trống..."
    FE_Admin->>WS: SEND /app/chat.send {content, roomId}
    WS->>Service: handleMessage()
    Service->>DB: Lưu ChatMessage (sender=ADMIN)
    WS->>FE_User: SEND /user/{userId}/queue/messages
    FE_User->>User: 💬 Hiển thị tin nhắn Admin real-time!
```

### Giải thích từng bước:

#### Bước 1 — Kết nối WebSocket
- Khi user/admin mở trang web, frontend tạo kết nối WebSocket qua **SockJS** (fallback nếu browser không hỗ trợ WebSocket).
- JWT token được gửi kèm để xác thực danh tính.
- **STOMP** (Simple Text Oriented Messaging Protocol) là protocol chạy trên WebSocket, giúp quản lý subscribe/publish dễ dàng.

#### Bước 2 — Subscribe (Đăng ký nhận tin)
- **User** subscribe vào `/user/queue/messages` — chỉ nhận tin nhắn gửi cho mình.
- **Admin** subscribe vào `/topic/admin/messages` — nhận TẤT CẢ tin nhắn từ mọi user.

#### Bước 3 — Gửi tin nhắn
- User gõ tin nhắn → Frontend gửi qua WebSocket đến `/app/chat.send`.
- Backend nhận, lưu vào DB, rồi **push ngay lập tức** cho Admin qua channel đã subscribe.
- **Không cần polling** — tin nhắn đến ngay tức thì (< 100ms).

#### Bước 4 — Admin trả lời
- Admin gõ reply → gửi qua WebSocket.
- Backend lưu DB + push cho đúng User qua `/user/{userId}/queue/messages`.

### Các Entity mới cần tạo:

```
ChatRoom (phòng chat)
├── id (Long)
├── user (User) — user tạo phòng chat
├── status (OPEN/CLOSED)
├── createdAt, lastMessageAt
│
ChatMessage (tin nhắn)
├── id (Long)
├── chatRoom (ChatRoom)
├── sender (User) — người gửi
├── content (String)
├── messageType (TEXT/IMAGE/SYSTEM)
├── readAt (LocalDateTime) — null = chưa đọc
├── createdAt
```

### Tại sao dùng WebSocket mà không dùng REST polling?

| | REST Polling | WebSocket |
|---|---|---|
| Độ trễ | 3-10 giây (tùy interval) | < 100ms (real-time) |
| Tải server | Cao (gọi liên tục dù không có tin mới) | Thấp (chỉ gửi khi có tin) |
| UX | Không mượt | Mượt như Messenger/Zalo |
| Trạng thái online | Khó implement | Dễ (biết ai đang connect) |
| Typing indicator | Rất khó | Dễ (gửi event "đang gõ...") |

---

## 8. Tổng Hợp Tất Cả Use Cases

```mermaid
graph TB
    subgraph "👤 User (Khách hàng)"
        U1["UC1: Đăng ký (OTP Email)"]
        U2["UC2: Đăng nhập (JWT)"]
        U3["UC3: Tìm kiếm khách sạn"]
        U4["UC4: Xem chi tiết khách sạn"]
        U5["UC5: Đặt phòng"]
        U6["UC6: Thanh toán QR (VietQR)"]
        U7["UC7: Hủy / Yêu cầu thay đổi booking"]
        U8["UC8: Đánh giá khách sạn"]
        U9["UC9: Quản lý Wishlist"]
        U10["UC10: Xem thông báo"]
        U11["UC11: Chat với AI Assistant"]
        U12["UC12: Chat real-time với Admin ⭐ MỚI"]
    end

    subgraph "🛡️ Admin"
        A1["UC13: Duyệt/Từ chối booking"]
        A2["UC14: Xác nhận thanh toán"]
        A3["UC15: Xử lý yêu cầu thay đổi"]
        A4["UC16: Quản lý khách sạn/phòng"]
        A5["UC17: Quản lý users"]
        A6["UC18: Xem thống kê dashboard"]
        A7["UC19: Xuất báo cáo Excel"]
        A8["UC20: Upload ảnh"]
        A9["UC21: Chat real-time với User ⭐ MỚI"]
    end

    subgraph "🤖 System"
        S1["UC22: JWT Authentication"]
        S2["UC23: Role-based Authorization"]
        S3["UC24: Email Notifications"]
        S4["UC25: In-app Notifications"]
        S5["UC26: Room Availability Check"]
        S6["UC27: WebSocket Real-time ⭐ MỚI"]
    end
```

---

## 9. Danh Sách Thay Đổi Cần Làm Cho Chat Real-time

> [!IMPORTANT]
> Dưới đây là checklist các file cần tạo/sửa để thêm tính năng chat real-time User ↔ Admin.

### Backend (Spring Boot)

| Loại | File | Mô tả |
|------|------|--------|
| 📦 DEP | `pom.xml` | Thêm `spring-boot-starter-websocket` |
| 🆕 Entity | `ChatRoom.java` | Phòng chat (1 user → 1 room) |
| 🆕 Entity | `ChatMessage.java` | Tin nhắn chat |
| 🆕 Enum | `MessageType.java` | TEXT / IMAGE / SYSTEM |
| 🆕 Repository | `ChatRoomRepository.java` | Query chat rooms |
| 🆕 Repository | `ChatMessageRepository.java` | Query messages |
| 🆕 Config | `WebSocketConfig.java` | STOMP + SockJS config |
| 🆕 Security | `WebSocketAuthInterceptor.java` | JWT auth cho WebSocket |
| 🆕 Controller | `ChatWebSocketController.java` | `@MessageMapping` handlers |
| 🆕 Controller | `ChatRestController.java` | REST API load history |
| 🆕 Service | `ChatService.java` | Business logic chat |
| ✏️ Sửa | `SecurityConfig.java` | Cho phép `/ws/**` endpoint |

### Frontend (React)

| Loại | File | Mô tả |
|------|------|--------|
| 📦 DEP | `package.json` | Thêm `@stomp/stompjs`, `sockjs-client` |
| 🆕 Hook | `useWebSocket.ts` | Custom hook quản lý kết nối |
| 🆕 Context | `ChatContext.tsx` | Global chat state |
| 🆕 Component | `ChatWidget.tsx` | Widget chat User ↔ Admin (thay thế AIAssistantWidget) |
| 🆕 Page | `AdminChatPage.tsx` | Trang chat cho Admin (danh sách rooms + chat) |
| ✏️ Sửa | `App.tsx` | Thêm route + render ChatWidget globally |
| ✏️ Sửa | `Header.tsx` | Badge tin nhắn chưa đọc |

---

> [!NOTE]
> File này tổng hợp toàn bộ cấu trúc, chức năng, và luồng hoạt động của dự án WebBookingCuoiKy. Phần chat real-time (mục 7-9) mô tả kiến trúc cần xây dựng mới.
