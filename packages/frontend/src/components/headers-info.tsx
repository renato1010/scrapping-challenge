import { useMemo } from 'react';
import type { SecureHeadersInfo } from '../api';
import { Truncate } from './truncate';

type HeadersInfoProps = {
  url: string;
  headersInfo: SecureHeadersInfo | null;
};
const HeadersInfo = ({ url, headersInfo }: HeadersInfoProps) => {
  const noHeadersInfo = <p>No secure headers info available</p>;
  if (!headersInfo) {
    return noHeadersInfo;
  }
  const headersKeyCount = Object.keys(headersInfo).length;
  if (!headersKeyCount) {
    return noHeadersInfo;
  }
  const headersEntries = useMemo(() => {
    return Object.entries(headersInfo);
  }, [headersInfo]);

  return (
    <div className='mt-8 p-6 flow-root w-4/5'>
      <h2>
        Secure Headers Info for: <span className='font-bold text-slate-800'>{url}</span>
      </h2>
      <div>
        {HeadersInfoTitle}
        {headersEntries.map(([header, { value, ok }]) => {
          return <HeaderRow3Cols key={header} content={[header, value, ok]} />;
        })}
      </div>
    </div>
  );
};

export { HeadersInfo };

type HeadersRow3ColsProps = {
  content: [string, string, boolean];
};
const HeaderRow3Cols = ({ content: [header, value, ok] }: HeadersRow3ColsProps) => {
  return (
    <div className={`flex rounded-sm p-4 ${ok ? 'bg-green-200' : 'bg-red-200'}`}>
      <div className='flex-auto w-1/4 text-center'>{header}</div>
      <div className='flex-auto w-2/4'>{<Truncate id={1} text={value} limit={200} class='font-semibold text-sm text-gray-800 cursor-pointer' />}</div>
      <div className='flex-auto w-1/4 text-center'>{String(ok)}</div>
    </div>
  );
};

const HeadersInfoTitle = (
  <div className='flex space-x-2 font-bold'>
    <div className='flex-auto w-1/4 text-center'>header</div>
    <div className='flex-auto w-2/4 text-center'>value</div>
    <div className='flex-auto w-1/4 text-center'>OK</div>
  </div>
);
