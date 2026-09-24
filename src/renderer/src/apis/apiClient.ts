const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const apiClient = {
  get: async <T>(
    url: string,
    option?: { authorization?: boolean; params?: Record<string, string> }
  ): Promise<T> => {
    const query = new URLSearchParams(option?.params);
    const urlObj = new URL(baseUrl + url);
    urlObj.search = query.toString();
    const res = await fetch(urlObj, {
      method: 'GET',
      headers: {
        ...(option?.authorization && {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      }
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return await res.json();
  },

  post: async <T, U>(
    url: string,
    body: U,
    option?: { authorization?: boolean; params?: Record<string, string> }
  ): Promise<T> => {
    const query = new URLSearchParams(option?.params);
    const urlObj = new URL(baseUrl + url);
    urlObj.search = query.toString();
    const res = await fetch(urlObj, {
      method: 'POST',
      headers: {
        ...(option?.authorization && {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
    return await res.json();
  },

  patch: async <U>(
    url: string,
    body: U,
    option?: { authorization?: boolean; params?: Record<string, string> }
  ): Promise<void> => {
    const query = new URLSearchParams(option?.params);
    const urlObj = new URL(baseUrl + url);
    urlObj.search = query.toString();
    const res = await fetch(urlObj, {
      method: 'PATCH',
      headers: {
        ...(option?.authorization && {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      throw new Error(String(res.status));
    }
  }
};
