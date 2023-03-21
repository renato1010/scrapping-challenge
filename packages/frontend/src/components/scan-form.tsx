import { useCallback, useState } from 'react';
import { ScanInput } from './scan-input';

type ErrorKeys = 'fqdnError' | 'urlError';
export type ValidationError = Record<ErrorKeys, string | null>;
const ScanForm = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationError>({ fqdnError: null, urlError: null });
  const [showErrors, setShowErrors] = useState(false);

  const validationHandler: (errors: ValidationError) => void = useCallback((errors) => {
    setShowErrors(true);
    setValidationErrors(errors);
  }, []);

  return (
    <div className='space-y-2'>
      <ScanInput onValidation={validationHandler} />
      {showErrors && validationErrors.fqdnError && <p className='text-sm text-red-400 italic'>is not a fully qualified domain name</p>}
      {showErrors && validationErrors.urlError && <p className='text-sm text-red-400 italic'>is not a valid URL</p>}
    </div>
  );
};

export { ScanForm };
