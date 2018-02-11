import { stringFormat } from '@scola/d3-string-format';

export default function formatString(prefix) {
  return (name = 'object') => {
    return stringFormat(prefix[name]);
  };
}
