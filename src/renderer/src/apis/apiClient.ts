const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface RequestOption {
  authorization?: boolean;
  params?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export class NetworkError extends Error {
  constructor() {
    super('네트워크 연결을 확인해주세요.');
  }
}

const buildUrl = (url: string, params?: Record<string, string>): URL => {
  const urlObj = new URL(baseUrl + url);
  urlObj.search = new URLSearchParams(params).toString();
  return urlObj;
};

const refreshToken = async (): Promise<boolean> => {
  const refresh_token = localStorage.getItem('refresh-token');
  if (!refresh_token) return false;

  const res = await fetch(new URL(baseUrl + '/user/refresh'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token })
  });
  if (!res.ok) return false;

  const data = await res.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('refresh-token', data.refresh_token);
  return true;
};

const doFetch = async (
  method: string,
  urlObj: URL,
  headers: Record<string, string>,
  body?: unknown
): Promise<Response> => {
  try {
    return await fetch(urlObj, {
      method,
      headers,
      ...(body !== undefined && { body: JSON.stringify(body) })
    });
  } catch {
    throw new NetworkError();
  }
};

const throwApiError = async (res: Response): Promise<never> => {
  const data = await res.json().catch(() => null);
  throw new ApiError(res.status, data?.message ?? '알 수 없는 오류가 발생했습니다.', data?.code);
};

const request = async (
  method: string,
  urlObj: URL,
  option?: RequestOption,
  body?: unknown
): Promise<Response> => {
  const headers: Record<string, string> = {
    ...(option?.authorization && {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }),
    ...(body !== undefined && { 'Content-Type': 'application/json' })
  };

  const res = await doFetch(method, urlObj, headers, body);

  if (res.status === 401 && option?.authorization) {
    const refreshed = await refreshToken();
    if (refreshed) {
      const retryHeaders = { ...headers, Authorization: `Bearer ${localStorage.getItem('token')}` };
      const retryRes = await doFetch(method, urlObj, retryHeaders, body);
      if (!retryRes.ok) return throwApiError(retryRes);
      return retryRes;
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refresh-token');
    window.location.hash = '#/';
    throw new ApiError(401, '로그인이 만료되었습니다. 다시 로그인해주세요.');
  }

  if (!res.ok) {
    return throwApiError(res);
  }

  return res;
};

export const apiClient = {
  get: async <T>(url: string, option?: RequestOption): Promise<T> => {
    const urlObj = buildUrl(url, option?.params);
    const res = await request('GET', urlObj, option);
    return await res.json();
  },

  post: async <T, U>(url: string, body: U, option?: RequestOption): Promise<T> => {
    const urlObj = buildUrl(url, option?.params);
    const res = await request('POST', urlObj, option, body);
    return await res.json();
  },

  patch: async <U>(url: string, body: U, option?: RequestOption): Promise<void> => {
    const urlObj = buildUrl(url, option?.params);
    await request('PATCH', urlObj, option, body);
  }
};
