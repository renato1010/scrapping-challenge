import isFQDN from 'validator/lib/isFQDN';
import isURL from 'validator/lib/isURL';

const customUrlValidation = (target: string) => {
  return isURL(target, { protocols: ['https'], require_protocol: true });
};
export { isFQDN, customUrlValidation };
