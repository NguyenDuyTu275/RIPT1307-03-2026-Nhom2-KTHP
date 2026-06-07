import {
  Api,
  Booking,
  BookingRequest,
  CreateBookingRequestDto,
  Hotel,
  ProcessBookingRequestDto,
  Review,
  Room,
  User,
} from './api-generated';

// ─── Khởi tạo Swagger client ──────────────────────────────────
// baseUrl = '' để dựa vào Vite proxy (forward tới localhost:8080)
const swaggerApi = new Api({
  baseURL: '/proxy',
  // Tự động gắn JWT token cho mọi request
  securityWorker: () => {
    const token = localStorage.getItem('token');
    if (token) {
      return { headers: { Authorization: `Bearer ${token}` } };
    }
    return {};
  },
});

export default swaggerApi;

// ─── Param mặc định: luôn parse response thành JSON ──────────
const JSON_FMT = { format: 'json' as const };
const TEXT_FMT = { format: 'text' as const };

// ─── AUTH ─────────────────────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    swaggerApi.auth.login({ username, password }, TEXT_FMT),

  register: (username: string, password: string, email: string) =>
    swaggerApi.auth.register({ username, password, email }, TEXT_FMT),

  verifyOtp: (email: string, otp: string) =>
    swaggerApi.auth.verifyOtp({ email, otp }, TEXT_FMT),

  googleLogin: (credential: string) =>
    fetch('/proxy/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    }).then(async res => {
      if (!res.ok) throw new Error(await res.text());
      return res.text();
    }),

  forgotPassword: (username: string) =>
    fetch('/proxy/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    }).then(async res => {
      if (!res.ok) throw new Error(await res.text());
      return res.text();
    }),

  resetPassword: (username: string, otp: string, newPassword: string) =>
    fetch('/proxy/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, otp, newPassword }),
    }).then(async res => {
      if (!res.ok) throw new Error(await res.text());
      return res.text();
    }),
};

export const chatApi = {
  sendMessage: (messages: any[], hotelInfo: any) => {
    return fetch('/proxy/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ messages, hotelInfo })
    }).then(res => res.json());
  }
};

// ─── USERS ────────────────────────────────────────────────────
export const userApi = {
  getAll: () => swaggerApi.users.getAll(JSON_FMT),
  getById: (id: number) => swaggerApi.users.getUser(id, JSON_FMT),
  create: (data: User) => swaggerApi.users.create(data, JSON_FMT),
  update: (id: number, data: User) => swaggerApi.users.update(id, data, JSON_FMT),
  delete: (id: number) => swaggerApi.users.delete(id, JSON_FMT),
};

// ─── HOTELS ───────────────────────────────────────────────────
export const hotelApi = {
  getAll: () => swaggerApi.hotels.getAll1(JSON_FMT),
  getById: (id: number) => swaggerApi.hotels.getById(id, JSON_FMT),
  create: (data: Hotel) => swaggerApi.hotels.create2(data, JSON_FMT),
  update: (id: number, data: Hotel) => swaggerApi.hotels.update1(id, data, JSON_FMT),
  delete: (id: number) => swaggerApi.hotels.delete1(id, JSON_FMT),
};

// ─── ROOMS ────────────────────────────────────────────────────
export const roomApi = {
  getByHotel: (hotelId: number) => swaggerApi.rooms.getByHotel(hotelId, JSON_FMT),
  create: (hotelId: number, data: Room) => swaggerApi.rooms.create1(hotelId, data, JSON_FMT),
  delete: (id: number) => swaggerApi.rooms.delete2(id, JSON_FMT),
};

// ─── BOOKINGS ─────────────────────────────────────────────────
export const bookingApi = {
  create: (hotelId: number, data: BookingRequest) =>
    swaggerApi.bookings.createBooking(hotelId, data, JSON_FMT),
  getMy: () => swaggerApi.bookings.myBookings(JSON_FMT),
  getMyBookings: () => swaggerApi.bookings.myBookings(JSON_FMT),
  cancel: (bookingId: number) => swaggerApi.bookings.cancelBooking(bookingId, JSON_FMT),
  createRequest: (bookingId: number, data: CreateBookingRequestDto) =>
    swaggerApi.bookings.createRequest(bookingId, data, JSON_FMT),
  getRequests: (bookingId: number) =>
    swaggerApi.bookings.getRequests(bookingId, JSON_FMT),
};

// ─── PAYMENTS ─────────────────────────────────────────────────
export const paymentApi = {
  getPaymentQr: (bookingId: number) => {
    return fetch(`/proxy/bookings/${bookingId}/payment-qr`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(async res => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Lỗi lấy QR');
      }
      return res.json();
    });
  },
  confirmPayment: (bookingId: number) => {
    return fetch(`/proxy/bookings/${bookingId}/confirm-payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(async res => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Lỗi xác nhận');
      }
      return res.json();
    });
  }
};

// ─── NOTIFICATIONS ────────────────────────────────────────────
export const notificationApi = {
  getMy: () => swaggerApi.notifications.getMyNotifications(JSON_FMT),
  markAsRead: (notificationId: number) =>
    swaggerApi.notifications.markAsRead(notificationId, JSON_FMT),
  delete: (notificationId: number) =>
    fetch(`/proxy/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }),
};

// ─── ADMIN ────────────────────────────────────────────────────
export const adminApi = {
  // Đặt phòng
  getBookings: (status?: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED') =>
    swaggerApi.admin.getBookings(status ? { status } : {}, JSON_FMT),
  approveBooking: (bookingId: number) =>
    swaggerApi.admin.approveBooking(bookingId, JSON_FMT),
  rejectBooking: (bookingId: number, response?: string) =>
    swaggerApi.admin.rejectBooking(bookingId, { response } as ProcessBookingRequestDto, JSON_FMT),
  markBookingPaid: (bookingId: number) =>
    swaggerApi.admin.markBookingPaid(bookingId, JSON_FMT),

  // Yêu cầu đặt phòng
  getBookingRequests: (status?: 'PENDING' | 'APPROVED' | 'REJECTED') =>
    swaggerApi.admin.getBookingRequests(status ? { status } : {}, JSON_FMT),
  approveBookingRequest: (requestId: number, response?: string) =>
    swaggerApi.admin.approveBookingRequest(requestId, { response } as ProcessBookingRequestDto, JSON_FMT),
  rejectBookingRequest: (requestId: number, response?: string) =>
    swaggerApi.admin.rejectBookingRequest(requestId, { response } as ProcessBookingRequestDto, JSON_FMT),

  // Thống kê & Báo cáo
  getOverview: () => swaggerApi.admin.getOverview(JSON_FMT),
  exportBookingsExcel: () => swaggerApi.admin.exportBookings(JSON_FMT),
};

// ─── REVIEWS ──────────────────────────────────────────────────
export const reviewApi = {
  getAll: () => swaggerApi.api.getAll2(JSON_FMT),
  create: (data: Review) => swaggerApi.api.create3(data, JSON_FMT),
};

// ─── IMAGES ───────────────────────────────────────────────────
export const imageApi = {
  uploadHotelImage: (hotelId: number, file: File) =>
    swaggerApi.images.uploadHotelImage(hotelId, { file }, JSON_FMT),
  uploadRoomImage: (roomId: number, file: File) =>
    swaggerApi.images.uploadRoomImage(roomId, { file }, JSON_FMT),
};
