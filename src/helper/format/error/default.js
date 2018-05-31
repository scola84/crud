import { stringFormat } from '@scola/d3-string-format';

export default function formatDefaultError(format, type) {
  const formatError = stringFormat('error.' + type);

  return (datum, index, nodes, { error }) => {
    let code = error.message.match(/^(\d{3})/);
    code = code && code.pop() || error.message;

    return format('error.' + type + '.' + code) || formatError(code);
  };
}
