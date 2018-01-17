import { stringFormat } from '@scola/d3-string-format';

export default function formatValidatorError(sname) {
  const formatMessage = stringFormat('validator.error.long');
  const formatName = stringFormat(sname + '.form.l1');
  const formatType = stringFormat('validator.type');

  return (datum, index, nodes, { error }) => {
    const name = error.field ? formatName(error.field.name) : null;
    const type = error.field ? formatType(error.field.type) : null;

    if (error.reason) {
      return formatMessage(error.message + '.' + error.reason, name, type);
    }

    return formatMessage(error.message + '.' + error.field.type,
      name.toLowerCase());
  };
}
