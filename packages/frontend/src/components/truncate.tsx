import { useCallback, useMemo, useState } from 'react';
import { assertExhaustive } from '../utilities';

export type TruncateProps = {
  id: string | number;
  text: string;
  ellipsis?: string;
  label?: string;
  limit?: number;
  class?: string;
  mode?: EllipsisMode;
};

export type EllipsisMode = 'InPlace' | 'After' | 'Before';

export const Truncate = ({ text, id, label, class: className, mode = 'Before', limit: maxLength, ellipsis = '...' }: TruncateProps) => {
  const [showMore, setShowMore] = useState<string | number>();
  const limit = maxLength ?? 200;

  const ellipsisStr = useMemo(() => {
    if (text.length > limit + ellipsis.length) {
      let breakpoint;

      switch (mode) {
        case 'After':
          breakpoint = limit + text.substring(limit).indexOf(' ');
          break;

        case 'Before':
          breakpoint = text.substring(0, limit).lastIndexOf(' ');
          break;
        case 'InPlace':
          return text.slice(0, limit - ellipsis.length) + ellipsis;
        default:
          assertExhaustive(mode);
      }

      return text.substring(0, breakpoint) + ellipsis;
    } else {
      return text;
    }
  }, [text]);

  const onClick = useCallback(() => {
    setShowMore(id);
  }, [id, setShowMore]);

  return (
    <>
      <span>{showMore === id ? text : ellipsisStr}</span>
      {text.length > limit && showMore !== id && (
        <span className={className ?? 'more'} onClick={onClick}>
          {label ?? 'Show more'}
        </span>
      )}
    </>
  );
};
