'use client';

import { useEffect, useState } from 'react';

export function useOrgId(): string {
  const [organizationId, setOrganizationId] = useState('');
  useEffect(() => {
    setOrganizationId(window.localStorage.getItem('cf_org') ?? '');
  }, []);
  return organizationId;
}
