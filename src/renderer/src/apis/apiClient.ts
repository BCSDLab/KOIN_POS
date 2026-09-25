const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface RequestOption {
  authorization?: boolean;
  params?: Record<string, string>;
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

  const res = await fetch(urlObj, {
    method,
    headers,
    ...(body !== undefined && { body: JSON.stringify(body) })
  });

  if (res.status === 401 && option?.authorization) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return fetch(urlObj, {
        method,
        headers: { ...headers, Authorization: `Bearer ${localStorage.getItem('token')}` },
        ...(body !== undefined && { body: JSON.stringify(body) })
      });
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refresh-token');
    window.location.hash = '#/';
    throw new Error('401');
  }

  if (!res.ok) {
    throw new Error(String(res.status));
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
