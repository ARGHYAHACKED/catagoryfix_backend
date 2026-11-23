'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

/**
 * Whether the visitor is signed in, for public pages.
 * Anonymous visitors (no stored token) never hit the API. With a token, we show the
 * signed-in state straight away and confirm it with /auth/me; if that fails, the
 * token is stale and we fall back to signed-out.
 */
export function useIsSignedIn(): boolean {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    try {
      setHasToken(Boolean(localStorage.getItem('cf_token')));
    } catch {
      setHasToken(false);
    }
  }, []);

  const { isError } = useQuery({
    queryKey: ['auth-me'],
    queryFn: () => api<{ user: { name?: string | null; email: string; systemRole: string } }>('/auth/me'),
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60_000,
  });

  return hasToken && !isError;
}
