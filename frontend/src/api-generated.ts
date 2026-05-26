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

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:8080";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
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
  };
}
