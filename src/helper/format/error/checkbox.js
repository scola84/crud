import { stringFormat } from '@scola/d3-string-format';

export default function formatCheckboxError(name) {
  return (datum, index, nodes, { error }) => {
    const formatError = stringFormat('validator.error.long');
    const formatName = stringFormat(name);

    return formatError(
      error.message + '.checkbox',
      formatName('nav.l1.0').toLowerCase()
    );
  };
}
