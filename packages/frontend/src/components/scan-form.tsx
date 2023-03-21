import { useCallback, useState } from 'react';
import { ScanInput } from './scan-input';
import { useRunScan } from '../api';

type ErrorKeys = 'fqdnError' | 'urlError';
export type ValidationError = Record<ErrorKeys, string | null>;
const ScanForm = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationError>({ fqdnError: null, urlError: null });
  const [showErrors, setShowErrors] = useState(false);
  const [url, setUrl] = useState('');

  const { execScan, scanData, status } = useRunScan();

  const onUrlChange: (url: string) => void = useCallback((urlStr: string) => {
    setUrl(urlStr);
  }, []);

  const validationHandler: (errors: ValidationError) => void = useCallback((errors) => {
    setShowErrors(true);
    setValidationErrors(errors);
    const { fqdnError, urlError } = errors;
    if (!fqdnError && !urlError) {
      // eslint-disable-next-line no-console
      console.log({ url });
      execScan(url);
    }
  }, []);

  //TODO:Render Scan Results

  // eslint-disable-next-line no-console
  console.log({ scanData, status });

  return (
    <div className='space-y-2'>
      <ScanInput url={url} onUrlChange={onUrlChange} onValidation={validationHandler} />
      {showErrors && validationErrors.fqdnError && <p className='text-sm text-red-400 italic'>is not a fully qualified domain name</p>}
      {showErrors && validationErrors.urlError && <p className='text-sm text-red-400 italic'>is not a valid URL</p>}
    </div>
  );
};

export { ScanForm };
