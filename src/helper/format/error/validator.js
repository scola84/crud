import { stringFormat } from '@scola/d3-string-format';

export default function formatValidatorError(name) {
  const formatMessage = stringFormat('validator.error.long');
  const formatName = stringFormat(name + '.form.label');
  const formatType = stringFormat('validator.type');

  return (datum, index, nodes, { error }) => {
    return formatMessage(
      error.message + '.' + error.reason,
      error.field ? formatName(error.field.name) : null,
      error.field ? formatType(error.field.type) : null
    );
  };
}
