import { stringFormat } from '@scola/d3-string-format';

export default function formatCheckboxError(name) {
  return (datum, index, nodes, { error }) => {
    const formatMessage = stringFormat('validator.error.long');
    const formatName = stringFormat(name);

    return formatMessage(
      error.message + '.checkbox',
      formatName('nav.label.0').toLowerCase()
    );
  };
}
