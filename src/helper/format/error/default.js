import { stringFormat } from '@scola/d3-string-format';

export default function formatDefaultError(format, type) {
  const formatError = stringFormat('error.' + type);

  return (datum, index, nodes, { error }) => {
    return format('error.' + type + '.' + error.message) ||
      formatError(error.message);
  };
}
