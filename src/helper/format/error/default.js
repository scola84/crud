import { stringFormat } from '@scola/d3-string-format';

export default function formatDefaultError(type) {
  const format = stringFormat('error.' + type);

  return (datum, index, nodes, { error }) => {
    return format(error.message);
  };
}
