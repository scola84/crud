import { stringFormat } from '@scola/d3-string-format';

export default function formatValidatorError(format) {
  const formatMessage = stringFormat('validator.error.long');
  const formatType = stringFormat('validator.type');

  return (datum, index, nodes, { error, route }) => {
    const name = format('form.l1.' + error.field.name) ||
      format('form.placeholder.' + error.field.name) ||
      error.field.name;

    const type = formatType(error.field.type);

    if (error.reason) {
      if (error.reason === 'custom') {
        return format('form.error.' + error.field.name, route, error);
      }

      if (error.reason === 'length' || error.reason === 'range') {
        const [min = null, max = null] = error.field[error.reason];
        let scope = '';

        if (min !== null && max !== null) {
          scope = min === max ? 'exact' : 'minmax';
        } else if (min !== null) {
          scope = 'min';
        } else if (max !== null) {
          scope = 'max';
        }

        return formatMessage('400.' + error.reason +
          '.' + scope, { name, min, max });
      }

      return formatMessage('400.' + error.reason, {
        length: error.field.length,
        name,
        type
      });
    }

    return formatMessage('400.' + error.field.type, {
      name: name.toLowerCase()
    });
  };
}
