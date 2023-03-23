import { useCallback, useState } from 'react';
import { ScanInput } from './scan-input';
import { isFQDN, customUrlValidation } from '../utilities';
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

  const validationHandler: (errors: ValidationError) => void = useCallback(
    (errors) => {
      setShowErrors(true);
      setValidationErrors(errors);
      const { fqdnError, urlError } = errors;
      if (!fqdnError && !urlError) {
        execScan(url);
      }
    },
    [url],
  );

  const validateURL = useCallback(() => {
    try {
      const fullURL = new URL(url);
      const fqdnError = isFQDN(fullURL.hostname) ? null : 'No fully qualified domain name';
      const urlError = customUrlValidation(url) ? null : 'No valid URL';
      validationHandler({ fqdnError, urlError });
    } catch (error) {
      const fqdnError = isFQDN(url) ? null : 'No fully qualified domain name';
      validationHandler({ fqdnError, urlError: 'No valid URL' });
    }
  }, [url]);

  //TODO:Render Scan Results

  // eslint-disable-next-line no-console
  console.log({ scanData, status, url });

  return (
    <div className='space-y-2'>
      <ScanInput url={url} onUrlChange={onUrlChange} onValidation={validateURL} status={status} />
      {showErrors && validationErrors.fqdnError && <p className='text-sm text-red-400 italic'>is not a fully qualified domain name</p>}
      {showErrors && validationErrors.urlError && <p className='text-sm text-red-400 italic'>is not a valid URL</p>}
    </div>
  );
};

export { ScanForm };
