import { useEffect, useState } from 'react';
import { hydrateTokens } from '../apis/apiClient';

export type SessionStatus = 'loading' | 'authenticated' | 'none';

export function useSessionRestore(): SessionStatus {
  const [status, setStatus] = useState<SessionStatus>(() => (window.api ? 'loading' : 'none'));

  useEffect(() => {
    if (!window.api) return;

    window.api
      .getTokens()
      .then((tokens) => {
        if (tokens) {
          hydrateTokens(tokens.token, tokens.refreshToken);
          setStatus('authenticated');
        } else {
          setStatus('none');
        }
      })
      .catch((error: unknown) => {
        console.error('세션 복원에 실패했습니다.', error);
        setStatus('none');
      });
  }, []);

  return status;
}
