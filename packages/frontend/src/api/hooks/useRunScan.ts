import { useState } from 'react';
import { type ApiStatus, type SecureHeadersInfo, api, hasError } from '../';

type TResponse = { ok: boolean; data: SecureHeadersInfo };
const useRunScan = () => {
  const [status, setStatus] = useState<ApiStatus>('IDLE');
  const [scanData, setScanData] = useState<SecureHeadersInfo | null>(null);

  const execScan = async (url: string) => {
    setStatus('PENDING');
    try {
      const respose = await api.post<{ url: string }, TResponse>('/scan', { url });
      if (hasError<TResponse>(respose)) {
        setStatus('ERROR');
      } else {
        setScanData(respose.data);
        setStatus('SUCCESS');
      }
    } catch (error) {
      setStatus('ERROR');
    }
  };

  return { scanData, status, execScan };
};

export { useRunScan };
