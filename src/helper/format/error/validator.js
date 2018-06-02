import { stringFormat } from '@scola/d3-string-format';

export default function formatValidatorError(format) {
  const formatMessage = stringFormat('validator.error.long');
  const formatType = stringFormat('validator.type');

  return (datum, index, nodes, { error }) => {
    const name = format('form.l1.' + error.field.name) ||
      format('form.placeholder.' + error.field.name);
    const type = formatType(error.field.type);

    if (error.reason) {
      if (error.reason === 'custom') {
        return format('form.error.' + error.field.name);
      }

      if (error.reason === 'range') {
        const [min, max] = error.field.range;
        let scope = '';

        if (min !== null && max !== null) {
          scope = 'minmax';
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
