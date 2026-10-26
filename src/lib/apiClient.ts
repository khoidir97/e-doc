/**
 * apiClient.ts
 *
 * HTTP client reusable untuk seluruh request ke API eksternal/internal.
 * Semua request secara otomatis menyertakan header X-API-KEY.
 *
 * Penggunaan (default internal API):
 *   import { apiClient } from '@/lib/apiClient';
 *   const data = await apiClient.get<MyType>('/endpoint');
 *
 * Penggunaan (API eksternal dengan config berbeda):
 *   import { createApiClient } from '@/lib/apiClient';
 *   const client = createApiClient({ baseUrl: 'http://20.40.40.16', ... });
 */

const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? 'BPKAD2026JAYA-P1209';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  /** Query params akan di-append ke URL secara otomatis */
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Body request (akan di-JSON.stringify otomatis) */
  body?: unknown;
  /** Override base URL jika diperlukan */
  baseUrl?: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildUrl(
  path: string,
  params?: ApiClientOptions['params'],
  baseUrl?: string
): string {
  const base = (baseUrl ?? BASE_URL).replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(
    `${base}${cleanPath}`,
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Kembalikan hanya pathname + search jika base URL tidak ada (relative URL)
  if (!base) {
    return `${url.pathname}${url.search}`;
  }

  return url.toString();
}

function buildHeaders(apiKey: string, customHeaders?: HeadersInit): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY': apiKey,
  });

  if (customHeaders) {
    new Headers(customHeaders).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
}

// ─── Core Fetch (Default) ─────────────────────────────────────────────────────

async function request<T = unknown>(
  method: string,
  path: string,
  options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
  const { params, body, baseUrl, headers: customHeaders, ...restInit } = options;

  const url = buildUrl(path, params, baseUrl);
  const headers = buildHeaders(API_KEY, customHeaders);

  const init: RequestInit = {
    method,
    headers,
    ...restInit,
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, init);

    let json: ApiResponse<T>;
    try {
      json = await response.json();
    } catch {
      throw new ApiError(
        response.status,
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        json.message ?? `HTTP ${response.status}: ${response.statusText}`,
        json
      );
    }

    return json;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, (error as Error).message ?? 'Terjadi kesalahan jaringan');
  }
}

// ─── Factory Function ─────────────────────────────────────────────────────────

export interface CreateApiClientConfig {
  /**
   * Base URL untuk semua request instance ini.
   * Contoh: 'http://20.40.40.16'
   */
  baseUrl: string;
  /**
   * API key untuk header X-API-KEY.
   * Default: nilai dari NEXT_PUBLIC_API_KEY / 'BPKAD2026JAYA-P1209'.
   */
  apiKey?: string;
  /**
   * Transformer opsional untuk mengonversi raw JSON response ke format
   * ApiResponse standar. Berguna jika API eksternal punya struktur berbeda.
   *
   * @example
   * // API BPKAD: { status: true, Info: "...", data: [...] }
   * responseTransformer: (raw) => ({
   *   success: raw.status === true,
   *   message: raw.Info ?? '',
   *   data: raw.data,
   * })
   */
  responseTransformer?: <T>(raw: any) => ApiResponse<T>;
}

/**
 * Factory untuk membuat instance API client yang terisolasi dengan konfigurasi
 * tersendiri (base URL, API key, dan format response).
 *
 * @example
 * const bpkadClient = createApiClient({
 *   baseUrl: 'http://20.40.40.16',
 *   apiKey: 'BPKAD2026JAYA-P1209',
 *   responseTransformer: (raw) => ({
 *     success: raw.status === true,
 *     message: raw.Info ?? '',
 *     data: raw.data,
 *   }),
 * });
 *
 * const res = await bpkadClient.get<Program[]>('/Api-Prog');
 */
export function createApiClient(config: CreateApiClientConfig) {
  const instanceApiKey = config.apiKey ?? API_KEY;
  const instanceBaseUrl = config.baseUrl.replace(/\/$/, '');
  const transformer = config.responseTransformer;

  async function instanceRequest<T = unknown>(
    method: string,
    path: string,
    options: ApiClientOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, body, headers: customHeaders, ...restInit } = options;

    const url = buildUrl(path, params, instanceBaseUrl);
    const headers = buildHeaders(instanceApiKey, customHeaders);

    const init: RequestInit = {
      method,
      headers,
      ...restInit,
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, init);

      let rawJson: any;
      try {
        rawJson = await response.json();
      } catch {
        throw new ApiError(
          response.status,
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // Terapkan transformer jika ada, atau gunakan raw JSON langsung
      const json: ApiResponse<T> = transformer
        ? transformer<T>(rawJson)
        : (rawJson as ApiResponse<T>);

      if (!response.ok || json.success === false) {
        throw new ApiError(
          response.status,
          json.message ?? `HTTP ${response.status}: ${response.statusText}`,
          json
        );
      }

      return json;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(0, (error as Error).message ?? 'Terjadi kesalahan jaringan');
    }
  }

  return {
    get<T = unknown>(path: string, options?: Omit<ApiClientOptions, 'body'>): Promise<ApiResponse<T>> {
      return instanceRequest<T>('GET', path, options);
    },
    post<T = unknown>(path: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
      return instanceRequest<T>('POST', path, options);
    },
    put<T = unknown>(path: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
      return instanceRequest<T>('PUT', path, options);
    },
    patch<T = unknown>(path: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
      return instanceRequest<T>('PATCH', path, options);
    },
    delete<T = unknown>(path: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
      return instanceRequest<T>('DELETE', path, options);
    },
  };
}

// ─── Default Client (Internal API) ───────────────────────────────────────────

export const apiClient = {
  /**
   * GET request ke API internal.
   * @example
   * const res = await apiClient.get<PegawaiListResult>('/api/pegawai', {
   *   params: { search: 'budi', page: 1, limit: 500 },
   * });
   */
  get<T = unknown>(
    path: string,
    options?: Omit<ApiClientOptions, 'body'>
  ): Promise<ApiResponse<T>> {
    return request<T>('GET', path, options);
  },

  /**
   * POST request ke API internal.
   * @example
   * const res = await apiClient.post<MasterDokumen>('/api/master-dokumen', { body: payload });
   */
  post<T = unknown>(path: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
    return request<T>('POST', path, options);
  },

  /**
   * PUT request ke API internal.
   */
  put<T = unknown>(path: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
    return request<T>('PUT', path, options);
  },

  /**
   * PATCH request ke API internal.
   */
  patch<T = unknown>(path: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
    return request<T>('PATCH', path, options);
  },

  /**
   * DELETE request ke API internal.
   * @example
   * const res = await apiClient.delete('/api/master-dokumen/1');
   */
  delete<T = unknown>(path: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
    return request<T>('DELETE', path, options);
  },
};
