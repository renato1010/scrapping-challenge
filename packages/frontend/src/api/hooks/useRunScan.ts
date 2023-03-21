import { useState } from 'react';
import { ApiStatus, api, hasError } from '../';

// type TResponse = { data: Product; ok: boolean };
type TResponse = { ok: boolean; data: Record<string, boolean> };
const useRunScan = () => {
  const [status, setStatus] = useState<ApiStatus>('IDLE');
  const [scanData, setScanData] = useState<Record<string, boolean>>({});

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
