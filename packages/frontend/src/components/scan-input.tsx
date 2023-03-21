import { isFQDN, customUrlValidation } from '../utilities';
import type { ValidationError } from './scan-form';
// import { CheckIcon } from '@heroicons/react/20/solid';

type ScanInputProps = {
  url: string;
  onValidation: (errors: ValidationError) => void;
  onUrlChange: (url: string) => void;
};

const ScanInput = ({ url, onValidation, onUrlChange }: ScanInputProps) => {
  const validateURL = () => {
    try {
      const fullURL = new URL(url);
      const fqdnError = isFQDN(fullURL.hostname) ? null : 'No fully qualified domain name';
      const urlError = customUrlValidation(url) ? null : 'No valid URL';
      onValidation({ fqdnError, urlError });
    } catch (error) {
      const fqdnError = isFQDN(url) ? null : 'No fully qualified domain name';
      onValidation({ fqdnError, urlError: 'No valid URL' });
    }
  };

  return (
    <div className='sm:grid sm:grid-cols-5 sm:items-start sm:gap-4 sm:border-gray-200 sm:pt-5'>
      <label htmlFor='url' className='block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5'>
        Enter a valid URL
      </label>
      <div className='mt-2 sm:col-span-3 sm:mt-0'>
        <div className='flex max-w-lg rounded-md shadow-sm'>
          <span
            className='inline-flex items-center rounded-l-md border border-r-0 border-gray-300 
          px-3 text-gray-500 sm:text-sm'
          >
            URL:
          </span>
          <input
            type='text'
            name='url'
            id='url'
            autoComplete='off'
            className='block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 
            py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={validateURL}
        type='button'
        className='inline-flex w-3/5 justify-around items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold 
        text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
        focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        {/* <CheckIcon className='-ml-0.5 mr-1.5 h-5 w-5' aria-hidden='true' /> */}
        Scan
      </button>
    </div>
  );
};

export { ScanInput };
