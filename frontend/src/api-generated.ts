/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface User {
  /** @format int64 */
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  role?: "USER" | "ADMIN";
}

export interface Notification {
  /** @format int64 */
  id?: number;
  title?: string;
  message?: string;
  read?: boolean;
  /** @format date-time */
  createdAt?: string;
  user?: User;
}

export interface Hotel {
  /** @format int64 */
  id?: number;
  name?: string;
  address?: string;
  city?: string;
  description?: string;
  imageUrl?: string;
  /** @format double */
  ratingAvg?: number;
  status?: string;
  /** @format date-time */
  createdAt?: string;
  rooms?: Room[];
}

export interface Room {
  /** @format int64 */
  id?: number;
  name?: string;
  type?: string;
  /** @format double */
  pricePerNight?: number;
  /** @format int32 */
  capacity?: number;
  /** @format int32 */
  quantity?: number;
  description?: string;
  /** @format date-time */
  createdAt?: string;
  images?: RoomImage[];
}

export interface RoomImage {
  /** @format int64 */
  id?: number;
  imageUrl?: string;
}

export interface Booking {
  /** @format int64 */
  id?: number;
  /** @format date */
  checkInDate?: string;
  /** @format date */
  checkOutDate?: string;
  /** @format double */
  totalPrice?: number;
  status?: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
  paymentStatus?: "UNPAID" | "PAID" | "REFUNDED";
  /** @format date-time */
  createdAt?: string;
  user?: User;
  hotel?: Hotel;
  bookingRooms?: BookingRoom[];
}

export interface BookingRoom {
  /** @format int64 */
  id?: number;
  /** @format int32 */
  quantity?: number;
  /** @format double */
  price?: number;
  room?: Room;
}

export interface ProcessBookingRequestDto {
  response?: string;
}

export interface BookingRequest {
  /** @format int64 */
  id?: number;
  type?: "CANCEL" | "CHANGE_DATE";
  /** @format date */
  newCheckIn?: string;
  /** @format date */
  newCheckOut?: string;
  reason?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  processedAt?: string;
  adminResponse?: string;
  booking?: Booking;
  processedBy?: User;
}

export interface CreateBookingRequestDto {
  type?: "CANCEL" | "CHANGE_DATE";
  /** @format date */
  newCheckIn?: string;
  /** @format date */
  newCheckOut?: string;
  reason?: string;
}

export interface VerifyOtpRequest {
  email?: string;
  otp?: string;
}

export interface RegisterRequest {
  username?: string;
  password?: string;
  email?: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface Review {
  /** @format int64 */
  id?: number;
  /** @format int32 */
  rating?: number;
  comment?: string;
  /** @format date-time */
  createdAt?: string;
  user?: User;
  hotel?: Hotel;
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8080" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Booking API
 * @version 1.0
 * @baseUrl http://localhost:8080
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  users = {
    /**
     * No description
     *
     * @tags user-controller
     * @name GetUser
     * @request GET:/users/{id}
     * @secure
     */
    getUser: (id: number, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name Update
     * @request PUT:/users/{id}
     * @secure
     */
    update: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name Delete
     * @request DELETE:/users/{id}
     * @secure
     */
    delete: (id: number, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/users/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name GetAll
     * @request GET:/users
     * @secure
     */
    getAll: (params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/users`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user-controller
     * @name Create
     * @request POST:/users
     * @secure
     */
    create: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  notifications = {
    /**
     * No description
     *
     * @tags notification-controller
     * @name MarkAsRead
     * @request PUT:/notifications/{notificationId}/read
     * @secure
     */
    markAsRead: (notificationId: number, params: RequestParams = {}) =>
      this.request<Notification, any>({
        path: `/notifications/${notificationId}/read`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notification-controller
     * @name GetMyNotifications
     * @request GET:/notifications/my
     * @secure
     */
    getMyNotifications: (params: RequestParams = {}) =>
      this.request<Notification[], any>({
        path: `/notifications/my`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  hotels = {
    /**
     * No description
     *
     * @tags hotel-controller
     * @name GetById
     * @request GET:/hotels/{id}
     * @secure
     */
    getById: (id: number, params: RequestParams = {}) =>
      this.request<Hotel, any>({
        path: `/hotels/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags hotel-controller
     * @name Update1
     * @request PUT:/hotels/{id}
     * @secure
     */
    update1: (id: number, data: Hotel, params: RequestParams = {}) =>
      this.request<Hotel, any>({
        path: `/hotels/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags hotel-controller
     * @name Delete1
     * @request DELETE:/hotels/{id}
     * @secure
     */
    delete1: (id: number, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/hotels/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags hotel-controller
     * @name GetAll1
     * @request GET:/hotels
     * @secure
     */
    getAll1: (params: RequestParams = {}) =>
      this.request<Hotel[], any>({
        path: `/hotels`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags hotel-controller
     * @name Create2
     * @request POST:/hotels
     * @secure
     */
    create2: (data: Hotel, params: RequestParams = {}) =>
      this.request<Hotel, any>({
        path: `/hotels`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  bookings = {
    /**
     * No description
     *
     * @tags booking-controller
     * @name CancelBooking
     * @request PUT:/bookings/cancel/{bookingId}
     * @secure
     */
    cancelBooking: (bookingId: number, params: RequestParams = {}) =>
      this.request<Booking, any>({
        path: `/bookings/cancel/${bookingId}`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags booking-controller
     * @name CreateBooking
     * @request POST:/bookings/{hotelId}
     * @secure
     */
    createBooking: (hotelId: number, data: BookingRequest, params: RequestParams = {}) =>
      this.request<Booking, any>({
        path: `/bookings/${hotelId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags booking-controller
     * @name GetRequests
     * @request GET:/bookings/{bookingId}/requests
     * @secure
     */
    getRequests: (bookingId: number, params: RequestParams = {}) =>
      this.request<BookingRequest[], any>({
        path: `/bookings/${bookingId}/requests`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags booking-controller
     * @name CreateRequest
     * @request POST:/bookings/{bookingId}/requests
     * @secure
     */
    createRequest: (bookingId: number, data: CreateBookingRequestDto, params: RequestParams = {}) =>
      this.request<BookingRequest, any>({
        path: `/bookings/${bookingId}/requests`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags booking-controller
     * @name MyBookings
     * @request GET:/bookings/my
     * @secure
     */
    myBookings: (params: RequestParams = {}) =>
      this.request<Booking[], any>({
        path: `/bookings/my`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  admin = {
    /**
     * No description
     *
     * @tags admin-controller
     * @name RejectBooking
     * @request PUT:/admin/bookings/{bookingId}/reject
     * @secure
     */
    rejectBooking: (bookingId: number, data: ProcessBookingRequestDto, params: RequestParams = {}) =>
      this.request<Booking, any>({
        path: `/admin/bookings/${bookingId}/reject`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-controller
     * @name MarkBookingPaid
     * @request PUT:/admin/bookings/{bookingId}/paid
     * @secure
     */
    markBookingPaid: (bookingId: number, params: RequestParams = {}) =>
      this.request<Booking, any>({
        path: `/admin/bookings/${bookingId}/paid`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-controller
     * @name ApproveBooking
     * @request PUT:/admin/bookings/{bookingId}/approve
     * @secure
     */
    approveBooking: (bookingId: number, params: RequestParams = {}) =>
      this.request<Booking, any>({
        path: `/admin/bookings/${bookingId}/approve`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-controller
     * @name RejectBookingRequest
     * @request PUT:/admin/booking-requests/{requestId}/reject
     * @secure
     */
    rejectBookingRequest: (requestId: number, data: ProcessBookingRequestDto, params: RequestParams = {}) =>
      this.request<BookingRequest, any>({
        path: `/admin/booking-requests/${requestId}/reject`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-controller
     * @name ApproveBookingRequest
     * @request PUT:/admin/booking-requests/{requestId}/approve
     * @secure
     */
    approveBookingRequest: (requestId: number, data: ProcessBookingRequestDto, params: RequestParams = {}) =>
      this.request<BookingRequest, any>({
        path: `/admin/booking-requests/${requestId}/approve`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-controller
     * @name GetOverview
     * @request GET:/admin/statistics/overview
     * @secure
     */
    getOverview: (params: RequestParams = {}) =>
      this.request<Record<string, any>, any>({
        path: `/admin/statistics/overview`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-controller
     * @name ExportBookings
     * @request GET:/admin/reports/bookings.xlsx
     * @secure
     */
    exportBookings: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/admin/reports/bookings.xlsx`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-controller
     * @name GetBookings
     * @request GET:/admin/bookings
     * @secure
     */
    getBookings: (
      query?: {
        status?: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";
      },
      params: RequestParams = {},
    ) =>
      this.request<Booking[], any>({
        path: `/admin/bookings`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-controller
     * @name GetBookingRequests
     * @request GET:/admin/booking-requests
     * @secure
     */
    getBookingRequests: (
      query?: {
        status?: "PENDING" | "APPROVED" | "REJECTED";
      },
      params: RequestParams = {},
    ) =>
      this.request<BookingRequest[], any>({
        path: `/admin/booking-requests`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),
  };
  rooms = {
    /**
     * No description
     *
     * @tags room-controller
     * @name Create1
     * @request POST:/rooms/{hotelId}
     * @secure
     */
    create1: (hotelId: number, data: Room, params: RequestParams = {}) =>
      this.request<Room, any>({
        path: `/rooms/${hotelId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags room-controller
     * @name GetByHotel
     * @request GET:/rooms/hotel/{hotelId}
     * @secure
     */
    getByHotel: (hotelId: number, params: RequestParams = {}) =>
      this.request<Room[], any>({
        path: `/rooms/hotel/${hotelId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags room-controller
     * @name Delete2
     * @request DELETE:/rooms/{id}
     * @secure
     */
    delete2: (id: number, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/rooms/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  images = {
    /**
     * Upload hotel image
     *
     * @tags image-controller
     * @name UploadHotelImage
     * @request POST:/api/images/hotel/{hotelId}
     * @secure
     */
    uploadHotelImage: (hotelId: number, data: { file: File }, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/api/images/hotel/${hotelId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * Upload room image
     *
     * @tags image-controller
     * @name UploadRoomImage
     * @request POST:/api/images/room/{roomId}
     * @secure
     */
    uploadRoomImage: (roomId: number, data: { file: File }, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/api/images/room/${roomId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),
  };
  auth = {
    /**
     * No description
     *
     * @tags auth-controller
     * @name VerifyOtp
     * @request POST:/auth/verify-otp
     * @secure
     */
    verifyOtp: (data: VerifyOtpRequest, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/auth/verify-otp`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth-controller
     * @name Register
     * @request POST:/auth/register
     * @secure
     */
    register: (data: RegisterRequest, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/auth/register`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth-controller
     * @name Login
     * @request POST:/auth/login
     * @secure
     */
    login: (data: LoginRequest, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  api = {
    /**
     * No description
     *
     * @tags review-controller
     * @name GetAll2
     * @request GET:/api/reviews
     * @secure
     */
    getAll2: (params: RequestParams = {}) =>
      this.request<Review[], any>({
        path: `/api/reviews`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags review-controller
     * @name Create3
     * @request POST:/api/reviews
     * @secure
     */
    create3: (data: Review, params: RequestParams = {}) =>
      this.request<Review, any>({
        path: `/api/reviews`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags image-controller
     * @name UploadRoomImage
     * @request POST:/api/images/room/{roomId}
     * @secure
     */
    uploadRoomImage: (
      roomId: number,
      data: {
        /** @format binary */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<object, any>({
        path: `/api/images/room/${roomId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags image-controller
     * @name UploadHotelImage
     * @request POST:/api/images/hotel/{hotelId}
     * @secure
     */
    uploadHotelImage: (
      hotelId: number,
      data: {
        /** @format binary */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<object, any>({
        path: `/api/images/hotel/${hotelId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),
  };
}
