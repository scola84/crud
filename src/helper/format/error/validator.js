import { stringFormat } from '@scola/d3-string-format';

export default function formatValidatorError(format) {
  const formatMessage = stringFormat('validator.error.long');
  const formatType = stringFormat('validator.type');

  return (datum, index, nodes, { error }) => {
    if (typeof error.field === 'undefined') {
      return error.message;
    }

    const name = format('form.l1.' + error.field.name);
    const type = formatType(error.field.type);

    if (error.reason) {
      return formatMessage(error.message + '.' + error.reason, name, type);
    }

    return formatMessage(error.message + '.' + error.field.type,
      name.toLowerCase());
  };
}
