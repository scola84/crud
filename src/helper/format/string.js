import { stringFormat } from '@scola/d3-string-format';

export default function formatString(base) {
  return (local) => {
    return stringFormat(local || base);
  };
}
