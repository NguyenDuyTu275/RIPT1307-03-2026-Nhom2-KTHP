import { Api, Booking, Hotel, User } from './api-generated';

const BASE_URL = window.location.origin;

// ─── SWAGGER GENERATED CLIENT INTEGRATION ────────────────────
const swaggerApi = new Api({
  baseURL: BASE_URL,
});

// Tự động đính kèm token JWT cho Swagger client
swaggerApi.instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Axios instance (dùng chung) ─────────────────────────────
const api = swaggerApi.instance;
export default api;

// ─── AUTH (Nối qua Swagger) ──────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    swaggerApi.auth.login({ username, password }).then(res => ({
      ...res,
      data: res.data
    })),

  register: (username: string, password: string, email: string) =>
    swaggerApi.auth.register({ username, password, email }).then(res => ({
      ...res,
      data: res.data
    })),

  verifyOtp: (email: string, otp: string) =>
    swaggerApi.auth.verifyOtp({ email, otp }).then(res => ({
      ...res,
      data: res.data
    })),
};

// ─── USERS (Nối qua Swagger) ─────────────────────────────────
export const userApi = {
  getAll: () => swaggerApi.users.getAll(),
  getById: (id: number) => swaggerApi.users.getUser(id),
  create: (data: User) => swaggerApi.users.create(data),
  update: (id: number, data: User) => swaggerApi.users.update(id, data),
  delete: (id: number) => swaggerApi.users.delete(id),
};

// ─── HOTELS (Nối qua Swagger) ────────────────────────────────
export const hotelApi = {
  getAll: () => swaggerApi.hotels.getAll1(),
  getById: (id: number) => swaggerApi.hotels.getById(id),
  create: (data: Hotel) => swaggerApi.hotels.create1(data),
  update: (id: number, data: Hotel) => swaggerApi.hotels.update1(id, data),
  delete: (id: number) => swaggerApi.hotels.delete1(id),
};

// ─── BOOKINGS (Nối qua Swagger) ──────────────────────────────
export const bookingApi = {
  create: (hotelId: number, data: any) => swaggerApi.bookings.createBooking(hotelId, data as Booking),
  getMy: () => swaggerApi.bookings.myBookings(),
  getMyBookings: () => swaggerApi.bookings.myBookings(),
  cancel: (bookingId: number) => swaggerApi.bookings.cancelBooking(bookingId),
};
