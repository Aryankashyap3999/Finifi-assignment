'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { getDocumentFileBlob } from '@/lib/api/documentsApi';
import { useAuth } from '@/providers/AuthProvider';

// The file is fetched as a blob (with the auth header) and turned into an
// object URL, since a plain <iframe>/<img src> can't attach an Authorization
// header and the file endpoint is protected like everything else.
export const useDocumentFileUrl = (documentId) => {
  const { token } = useAuth();
  const [objectUrl, setObjectUrl] = useState(null);

  const blobQuery = useQuery({
    queryKey: ['documentFile', documentId],
    queryFn: () => getDocumentFileBlob({ token, documentId }),
    enabled: Boolean(token) && Boolean(documentId)
  });

  useEffect(() => {
    if (!blobQuery.data) return undefined;
    const url = URL.createObjectURL(blobQuery.data);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [blobQuery.data]);

  return {
    url: objectUrl,
    mimeType: blobQuery.data?.type,
    isLoading: blobQuery.isLoading,
    isError: blobQuery.isError,
    error: blobQuery.error
  };
};
